
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FirebaseClientProvider, useUser, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { TrendingUp, Home, Star, FileText, Lightbulb, Book, LogOut, Menu, Milestone, ExternalLink, Trash2, PlusCircle, Calendar, User, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import Link from 'next/link';
import { getAuth, signOut } from 'firebase/auth';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { ThemeToggle } from '@/components/theme-toggle';
import { collection, query, where, getFirestore, doc } from 'firebase/firestore';
import type { IndividualDevelopmentPlan } from '@/types/idp';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { CreateIdpDialog } from '@/components/idp/create-idp-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { Course } from '@/types/course';
import { AddCourseDialog } from '@/components/employee/add-course-dialog';


const skillData = [
  { name: 'technical', value: 75 },
  { name: 'soft', value: 25 },
];
const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))'];

const initialCourses: Course[] = [
  { id: 1, title: 'Advanced TypeScript for Enterprise', provider: 'Udemy' },
  { id: 2, title: 'Microservices with Node.js and React', provider: 'Coursera' },
];

const recommendedCourses: Course[] = [
    { id: 10, title: 'AI for Project Managers', provider: 'AI Academy' },
    { id: 11, title: 'Advanced Communication Strategies', provider: 'Growth Institute' },
    { id: 12, title: 'Cloud-Native Architecture Deep Dive', provider: 'TechGurus' },
]

function EmployeeDashboardContent() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = getAuth();
  const [isClient, setIsClient] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();

  useAuthGuard();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  const addCourse = (course: Course) => {
    // This is a placeholder. In a real app, you'd update a state or DB
    toast({
        title: 'Course Added',
        description: `${course.title} has been added to your plan.`,
    });
  };

  if (isUserLoading || !user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  const NavLinks = ({onClick}: {onClick?: () => void}) => (
    <>
      <Link href="/employee/dashboard" className="flex items-center gap-2 font-semibold text-primary" onClick={onClick}>
        <Home className="h-5 w-5" /> Dashboard
      </Link>
      <Link href="/employee/my-idp" className="flex items-center gap-2 text-muted-foreground hover:text-foreground" onClick={onClick}>
        <FileText className="h-5 w-5" /> My IDP
      </Link>
       <Link href="/employee/courses" className="flex items-center gap-2 text-muted-foreground hover:text-foreground" onClick={onClick}>
        <Book className="h-5 w-5" /> Courses
      </Link>
    </>
  );

  return (
    <>
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
                <NavLinks onClick={() => setIsSheetOpen(false)} />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 space-y-8">
        {/* -- Dashboard Section -- */}
        <section id="dashboard" className="grid gap-4 sm:gap-6">
            <Card className="col-span-full">
                <CardHeader>
                <CardTitle>Career Growth - Senior Engineer</CardTitle>
                <CardDescription>Target: Oct 8, 2026</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">25%</span>
                </div>
                <Progress value={25} />
                </CardContent>
            </Card>
        </section>

        {/* -- Skills Section -- */}
        <section id="skills">
            <Card>
                <CardHeader>
                    <CardTitle>My Skills Breakdown</CardTitle>
                    <CardDescription>A look at your technical vs. soft skills.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex items-center justify-center h-full">
                {isClient && (
                    <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                        data={skillData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        dataKey="value"
                        paddingAngle={5}
                        >
                        {skillData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Legend
                        iconType="circle"
                        formatter={(value, entry) => {
                            const item = skillData.find(d => d.name === value);
                            return <span className="capitalize" style={{ color: "var(--foreground)" }}>{value} ({item?.value}%)</span>;
                        }}
                        />
                    </PieChart>
                    </ResponsiveContainer>
                )}
                </CardContent>
            </Card>
        </section>

        {/* -- Recommendations Section -- */}
        <section id="recommendations">
             <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Lightbulb className="h-6 w-6 text-primary"/>
                        AI-Powered Recommendations
                    </CardTitle>
                    <CardDescription>Courses and resources tailored to help you reach your goals.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    {recommendedCourses.map((course) => (
                        <div key={course.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-secondary">
                        <div>
                            <p className="font-semibold">{course.title}</p>
                            <p className="text-sm text-muted-foreground">{course.provider}</p>
                        </div>
                        <div className='flex items-center gap-2 self-end sm:self-center'>
                           <Button size="sm" onClick={() => addCourse(course)}>
                                <Plus className="mr-2 h-4 w-4" /> Add to Plan
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

export default function EmployeeDashboard() {
    return (
        <FirebaseClientProvider>
            <EmployeeDashboardContent />
        </FirebaseClientProvider>
    )
}
