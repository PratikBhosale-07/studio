
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Trash2, PlusCircle, TrendingUp, Home, Star, FileText, Lightbulb, Book, LogOut, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { getAuth, signOut } from 'firebase/auth';

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

  if (isUserLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6">
        <div className="flex items-center gap-4">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">IDP System</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
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
          <Link href="/employee/courses" className="flex items-center gap-2 text-primary">
             <Button variant="ghost" size="icon" className='bg-primary/10'><Book className="h-5 w-5" /></Button> Courses
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <span>{user.displayName || user.email}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>Courses you are enrolled in or have completed.</CardDescription>
            </div>
            <Button onClick={addCourse}><PlusCircle className='mr-2 h-4 w-4'/>Add Course</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                  <div>
                    <p className="font-semibold">{course.title}</p>
                    <p className="text-sm text-muted-foreground">{course.provider}</p>
                  </div>
                  <div className='flex items-center gap-2'>
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
