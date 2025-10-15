
'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Course } from '@/types/course';
import { BookOpen, Plus } from 'lucide-react';

const availableCourses: Course[] = [
  { id: 1, title: 'Advanced TypeScript for Enterprise', provider: 'Udemy' },
  { id: 2, title: 'Microservices with Node.js and React', provider: 'Coursera' },
  { id: 3, title: 'The Complete Guide to Project Leadership', provider: 'LinkedIn Learning' },
  { id: 4, title: 'Data Structures and Algorithms in Python', provider: 'edX' },
  { id: 5, title: 'Mastering Figma: From Beginner to Expert', provider: 'Skillshare' },
  { id: 6, title: 'Certified Kubernetes Administrator (CKA)', provider: 'Linux Foundation' },
  { id: 7, title: 'AWS Certified Solutions Architect - Associate', provider: 'Amazon Web Services' },
  { id: 8, title: 'Introduction to Machine Learning', provider: 'Coursera' },
];

interface AddCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCourse: (course: Course) => void;
}

export function AddCourseDialog({ open, onOpenChange, onAddCourse }: AddCourseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a Course</DialogTitle>
          <DialogDescription>Browse available courses and add them to your development plan.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72 w-full rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">Available Courses</h4>
            {availableCourses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary">
                <div className='flex items-center gap-3'>
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{course.title}</p>
                    <p className="text-sm text-muted-foreground">{course.provider}</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => onAddCourse(course)}>
                  <Plus className="mr-2 h-4 w-4" /> Add
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

    