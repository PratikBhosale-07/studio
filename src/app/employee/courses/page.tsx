
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Trash2, PlusCircle, TrendingUp, Home, Star, FileText, Lightbulb, Book, LogOut, ExternalLink, Menu } from 'lucide-react';
import Link from 'next/link';
import { getAuth, signOut } from 'firebase/auth';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { ThemeToggle } from '@/components/theme-toggle';


const initialCourses = [
  { id: 1, title: 'Advanced TypeScript for Enterprise', provider: 'Udemy' },
  { id: 2, title: 'Microservices with Node.js and React', provider: 'Coursera' },
  { id: 3, title: 'The Complete Guide to Project Leadership', provider: 'LinkedIn Learning' },
];

function CoursesContent() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = getAuth();
  const [courses, setCourses] = useState(initialCourses);
  
  useAuthGuard();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const removeCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const addCourse = () => {
    const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    const newCourse = { id: newId, title: `New Sample Course ${newId}`, provider: 'Platform' };
    setCourses([...courses, newCourse]);
  };

  if (isUserLoading || !user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  const NavLinks = () => (
     <>
      <Link href="/employee/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <Home className="h-5 w-5" /> Dashboard
      </Link>
      <Link href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <Star className="h-5 w-5" /> Skills
      </Link>
      <Link href="/employee/my-idp" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <FileText className="h-5 w-5" /> My IDP
      </Link>
      <Link href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <Lightbulb className="h-5 w-5" /> Recommendations
      </Link>
      <Link href="/employee/courses" className="flex items-center gap-2 text-primary font-semibold">
        <Book className="h-5 w-5" /> Courses
      </Link>
    </>
  )

  return (
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
          <span className='hidden sm:inline'>{user.displayName || user.email}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-0 sm:mr-2 h-4 w-4" /><span className='hidden sm:inline'>Logout</span>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
               <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
              <nav className="grid gap-6 text-lg font-medium mt-8">
                 <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <TrendingUp className="h-6 w-6" />
                  <span>TalentFlow</span>
                </Link>
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>Courses you are enrolled in or have completed.</CardDescription>
            </div>
            <Button onClick={addCourse} className='w-full sm:w-auto'><PlusCircle className='mr-2 h-4 w-4'/>Add Course</Button>
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
      </main>
    </div>
  );
}

export default function CoursesPage() {
    return (
        <FirebaseClientProvider>
            <CoursesContent />
        </FirebaseClientProvider>
    )
}
