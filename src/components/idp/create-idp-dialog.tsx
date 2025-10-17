
'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Plus, X, Loader2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { addDocumentNonBlocking, useUser, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { collection } from 'firebase/firestore';
import { extractResumeDetails } from '@/ai/flows/extract-resume-details';

const idpSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
  careerGoal: z.string().min(3, 'Career Goal must be at least 3 characters long.'),
  targetRole: z.string().min(3, 'Target Role must be at least 3 characters long.'),
  currentSkills: z.string().min(3, 'Please list at least one skill.'),
  skillsToDevelop: z.string().min(3, 'Please list at least one skill to develop.'),
  experienceSummary: z.string().min(10, 'Experience summary must be at least 10 characters long.'),
  endDate: z.date({
    required_error: 'A target completion date is required.',
  }),
  resume: z.any().optional(),
});

type IdpFormValues = z.infer<typeof idpSchema>;

interface CreateIdpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateIdpDialog({ open, onOpenChange }: CreateIdpDialogProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isExtracting, setIsExtracting] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IdpFormValues>({
    resolver: zodResolver(idpSchema),
    defaultValues: {
      title: '',
      description: '',
      careerGoal: '',
      targetRole: '',
      currentSkills: '',
      skillsToDevelop: '',
      experienceSummary: '',
      endDate: undefined,
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setIsExtracting(true);
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const resumeDataUri = reader.result as string;
          try {
            const extractedDetails = await extractResumeDetails({ resumeDataUri });
            setValue('careerGoal', extractedDetails.careerGoal);
            setValue('description', extractedDetails.summary);
            setValue('currentSkills', extractedDetails.currentSkills);
            setValue('skillsToDevelop', extractedDetails.skillsToDevelop);
            setValue('experienceSummary', extractedDetails.experienceSummary);
            toast({
              title: 'Resume Analyzed',
              description: 'We have pre-filled some fields based on your resume.',
            });
          } catch (aiError) {
            console.error('AI extraction error:', aiError);
            toast({
              variant: 'destructive',
              title: 'AI Error',
              description: 'Could not extract details from the resume.',
            });
          } finally {
            setIsExtracting(false);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('File reading error:', error);
        toast({
          variant: 'destructive',
          title: 'File Error',
          description: 'Could not read the selected file.',
        });
        setIsExtracting(false);
      }
    } else if (file) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a PDF file.',
      });
    }
  };

  const onSubmit = async (data: IdpFormValues) => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to create an IDP.',
      });
      return;
    }

    try {
      const idpCollection = collection(firestore, 'individual_development_plans');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { resume, ...idpData } = data;

      await addDocumentNonBlocking(idpCollection, {
        ...idpData,
        employeeId: user.uid,
        goals: data.skillsToDevelop.split(',').map(s => s.trim()),
        startDate: new Date().toISOString(),
        endDate: data.endDate.toISOString(),
        status: 'Not Started',
        managerFeedback: '',
        skillGapAnalysis: '',
      });

      toast({
        title: 'Success!',
        description: 'Your new IDP has been created.',
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating IDP:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus /> Create New IDP
          </DialogTitle>
          <DialogDescription>
            Fill out the form below, or upload a resume to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="resume">Upload Resume (PDF) to Auto-fill</Label>
            <div className="relative">
              <Input
                id="resume"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={isExtracting}
                className="pr-12"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {isExtracting ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  <Upload className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">IDP Title *</Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => <Input id="title" placeholder="e.g., Career Growth - Senior Engineer" {...field} />}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description *</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea id="description" placeholder="Describe your development plan..." {...field} />
              )}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="careerGoal">Career Goal *</Label>
              <Controller
                name="careerGoal"
                control={control}
                render={({ field }) => <Input id="careerGoal" placeholder="e.g., Advance to Senior Role" {...field} />}
              />
              {errors.careerGoal && <p className="text-sm text-destructive">{errors.careerGoal.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="targetRole">Target Role *</Label>
              <Controller
                name="targetRole"
                control={control}
                render={({ field }) => <Input id="targetRole" placeholder="e.g., Senior Software Engineer" {...field} />}
              />
              {errors.targetRole && <p className="text-sm text-destructive">{errors.targetRole.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="grid gap-2">
                <Label htmlFor="currentSkills">Current Skills *</Label>
                <Controller
                    name="currentSkills"
                    control={control}
                    render={({ field }) => <Input id="currentSkills" placeholder="e.g., React, Node.js, SQL" {...field} />}
                />
                {errors.currentSkills && <p className="text-sm text-destructive">{errors.currentSkills.message}</p>}
             </div>
             <div className="grid gap-2">
                <Label htmlFor="skillsToDevelop">Skills to Develop *</Label>
                <Controller
                    name="skillsToDevelop"
                    control={control}
                    render={({ field }) => <Input id="skillsToDevelop" placeholder="e.g., DevOps, Python, Leadership" {...field} />}
                />
                {errors.skillsToDevelop && <p className="text-sm text-destructive">{errors.skillsToDevelop.message}</p>}
             </div>
          </div>
           <div className="grid gap-2">
            <Label htmlFor="experienceSummary">Experience Summary *</Label>
            <Controller
              name="experienceSummary"
              control={control}
              render={({ field }) => (
                <Textarea id="experienceSummary" placeholder="Summarize your relevant experience..." {...field} />
              )}
            />
            {errors.experienceSummary && <p className="text-sm text-destructive">{errors.experienceSummary.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endDate">Target Completion Date *</Label>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.endDate && <p className="text-sm text-destructive">{errors.endDate.message}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting || isExtracting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting || isExtracting}>
              {isSubmitting ? 'Creating...' : 'Create IDP'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
