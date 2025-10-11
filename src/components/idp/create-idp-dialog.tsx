
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
import { CalendarIcon, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { addDocumentNonBlocking, useAuth, useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { collection } from 'firebase/firestore';

const idpSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
  careerGoal: z.string().min(3, 'Career Goal must be at least 3 characters long.'),
  targetRole: z.string().min(3, 'Target Role must be at least 3 characters long.'),
  endDate: z.date({
    required_error: 'A target completion date is required.',
  }),
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

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IdpFormValues>({
    resolver: zodResolver(idpSchema),
    defaultValues: {
      title: '',
      description: '',
      careerGoal: '',
      targetRole: '',
      endDate: undefined,
    },
  });

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
      await addDocumentNonBlocking(idpCollection, {
        ...data,
        employeeId: user.uid,
        goals: [data.careerGoal],
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
          <DialogDescription className="sr-only">
              Fill out the form to create a new Individual Development Plan.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
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
            <Label htmlFor="description">Description</Label>
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
              <Label htmlFor="careerGoal">Career Goal</Label>
              <Controller
                name="careerGoal"
                control={control}
                render={({ field }) => <Input id="careerGoal" placeholder="e.g., Advance to Senior Role" {...field} />}
              />
              {errors.careerGoal && <p className="text-sm text-destructive">{errors.careerGoal.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="targetRole">Target Role</Label>
              <Controller
                name="targetRole"
                control={control}
                render={({ field }) => <Input id="targetRole" placeholder="e.g., Senior Software Engineer" {...field} />}
              />
              {errors.targetRole && <p className="text-sm text-destructive">{errors.targetRole.message}</p>}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endDate">Target Completion Date</Label>
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
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create IDP'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
