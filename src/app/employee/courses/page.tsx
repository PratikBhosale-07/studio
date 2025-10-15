
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { TrendingUp, Home, FileText, Lightbulb, Book, LogOut, Menu, ExternalLink, Trash2, PlusCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { getAuth, signOut } from 'firebase/auth';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { ThemeToggle } from '@/components/theme-toggle';
import { useToast } from '@/hooks/use-toast';
import type { Course } from '@/types/course';
import { AddCourseDialog } from '@/components/employee/add-course-dialog';

const initialCourses: Course[] = [
  { id: 1, title: 'Advanced TypeScript for Enterprise', provider: 'Udemy' },
  { id: 2, title: 'Microservices with Node.js and React', provider: 'Coursera' },
  { id: 3, title: 'The Complete Guide to Project Leadership', provider: 'LinkedIn Learning' },
];

function EmployeeCoursesContent() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = getAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState(false);
  const [courses, setCourses] = useState(initialCourses);
  const { toast } = useToast();

  useAuthGuard();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  const removeCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const addCourse = (course: Course) => {
    if (courses.some(c => c.id === course.id)) {
        toast({
            variant: 'destructive',
            title: 'Course Already Added',
            description: 'You are already enrolled in this course.',
        });
        return;
    }
    setCourses([...courses, course]);
    toast({
        title: 'Course Added',
        description: `${course.title} has been added to your list.`,
    });
  };

  if (isUserLoading || !user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const NavLinks = ({onClick}: {onClick?: () => void}) => (
    <>
      <Link href="/employee/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground" onClick={onClick}>
        <Home className="h-5 w-5" /> Dashboard
      </Link>
      <Link href="/employee/my-idp" className="flex items-center gap-2 text-muted-foreground hover:text-foreground" onClick={onClick}>
        <FileText className="h-5 w-5" /> My IDP
      </Link>
       <Link href="/employee/courses" className="flex items-center gap-2 font-semibold text-primary" onClick={onClick}>
        <Book className="h-5 w-5" /> Courses
      </Link>
      <Link href="/employee/dashboard#recommendations" className="flex items-center gap-2 text-muted-foreground hover:text-foreground" onClick={onClick}>
        <Lightbulb className="h-5 w-5" /> Recommendations
      </Link>
    </>
  );

  return (
    <>
    <AddCourseDialog open={isAddCourseDialogOpen} onOpenChange={setIsAddCourseDialogOpen} onAddCourse={addCourse} />
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="#" className="flex items-center gap-2 font-semibold">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span>TalentFlow</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="hidden sm:inline">{user.displayName || user.email}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-0 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
          </Button>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background/80 backdrop-blur-sm">
               <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
              <nav className="grid gap-6 text-lg font-medium mt-8">
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <TrendingUp className="h-6 w-6" />
                  <span>TalentFlow</span>
                </Link>
                <NavLinks onClick={() => setIsSheetOpen(false)}/>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 space-y-8">
        <section id="courses">
            <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <CardTitle>My Courses</CardTitle>
                    <CardDescription>Courses you are enrolled in or have completed.</CardDescription>
                </div>
                <Button onClick={() => setIsAddCourseDialogOpen(true)} className='w-full sm:w-auto'><PlusCircle className='mr-2 h-4 w-4'/>Add Course</Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {courses.map((course) => (
                    <div key={course.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-secondary">
                    <div>
                        <p className="font-semibold">{course.title}</p>
                        <p className="text-sm text-muted-foreground">{course.provider}</p>
                    </div>
                    <div className='flex items-center gap-2 self-end sm:self-center'>
                        <Button variant="outline" size="sm" asChild>
                            <a href="#" target="_blank">View <ExternalLink className="ml-2 h-3 w-3" /></a>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => removeCourse(course.id)}>
                        <Trash2 className="h-5 w-5 text-destructive" />
                        </Button>
                    </div>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>
        </section>
      </main>
    </div>
    </>
  );
}

export default function EmployeeCoursesPage() {
    return (
        <FirebaseClientProvider>
            <EmployeeCoursesContent />
        </FirebaseClientProvider>
    )
}
