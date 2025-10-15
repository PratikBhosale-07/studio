
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

const skillData = [
  { name: 'technical', value: 75 },
  { name: 'soft', value: 25 },
];
const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))'];

const initialCourses = [
  { id: 1, title: 'Advanced TypeScript for Enterprise', provider: 'Udemy' },
  { id: 2, title: 'Microservices with Node.js and React', provider: 'Coursera' },
  { id: 3, title: 'The Complete Guide to Project Leadership', provider: 'LinkedIn Learning' },
];

function EmployeeDashboardContent() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = getAuth();
  const [isClient, setIsClient] = useState(false);
  const [isIdpDialogOpen, setIsIdpDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [courses, setCourses] = useState(initialCourses);
  const { toast } = useToast();

  const firestore = getFirestore();

  const idpsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'individual_development_plans'), where('employeeId', '==', user.uid));
  }, [firestore, user]);

  const { data: idpItems, isLoading: idpsLoading, error: idpError } = useCollection<IndividualDevelopmentPlan>(idpsQuery);

  useAuthGuard();

  useEffect(() => {
    setIsClient(true);
  }, []);

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
  
  const handleDeleteIdp = async (idpId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'individual_development_plans', idpId);
    try {
        deleteDocumentNonBlocking(docRef);
        toast({
            title: 'IDP Removed',
            description: 'The Individual Development Plan has been successfully removed.',
        });
    } catch (error) {
        console.error("Error removing document: ", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'There was a problem removing the IDP.',
        });
    }
  }


  if (isUserLoading || !user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  const loadingIdps = isUserLoading || idpsLoading;

  const NavLinks = ({onClick}: {onClick?: () => void}) => (
    <>
      <Link href="#dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground" onClick={onClick}>
        <Home className="h-5 w-5" /> Dashboard
      </Link>
      <Link href="#skills" className="flex items-center gap-2 text-muted-foreground hover:text-foreground" onClick={onClick}>
        <Star className="h-5 w-5" /> Skills
      </Link>
      <Link href="#my-idp" className="flex items-center gap-2 text-muted-foreground hover:text-foreground" onClick={onClick}>
        <FileText className="h-5 w-5" /> My IDP
      </Link>
       <Link href="#courses" className="flex items-center gap-2 text-muted-foreground hover:text-foreground" onClick={onClick}>
        <Book className="h-5 w-5" /> Courses
      </Link>
      <Link href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground" onClick={onClick}>
        <Lightbulb className="h-5 w-5" /> Recommendations
      </Link>
    </>
  );

  return (
    <>
    <CreateIdpDialog open={isIdpDialogOpen} onOpenChange={setIsIdpDialogOpen} />
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

        {/* -- My IDP Section -- */}
        <section id="my-idp">
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 p-6 rounded-xl shadow-inner mb-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Milestone className="h-8 w-8 text-blue-400" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                    My Individual Development Plans
                    </h1>
                </div>
                <Button
                    onClick={() => setIsIdpDialogOpen(true)}
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Create New IDP
                </Button>
                </div>
            </div>

            {loadingIdps ? (
                <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                </div>
            ) : idpError ? (
                <p className="text-destructive text-center">Error loading IDPs</p>
            ) : (
                <div className="space-y-4">
                {idpItems && idpItems.length > 0 ? (
                    idpItems.map((item) => (
                    <Card key={item.id} className='hover:shadow-md transition-shadow'>
                        <CardHeader>
                        <CardTitle className='flex justify-between items-center'>
                            {item.title}
                            <div className="flex items-center gap-2">
                            <Badge variant={item.status === 'Completed' ? 'secondary' : 'default'}>{item.status}</Badge>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteIdp(item.id)}>
                                <Trash2 className="h-5 w-5 text-destructive" />
                            </Button>
                            </div>
                        </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <p className='text-muted-foreground'>{item.description}</p>
                            <div className='flex flex-wrap gap-4 text-sm'>
                                <div className='flex items-center gap-2'>
                                    <User className='h-4 w-4 text-primary'/>
                                    <strong>Target Role:</strong> {item.targetRole}
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Calendar className='h-4 w-4 text-primary'/>
                                    <strong>Target Date:</strong> {format(new Date(item.endDate), 'PPP')}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-10">
                        <p>No IDPs found. Create one to get started!</p>
                    </div>
                )}
                </div>
            )}
        </section>

        {/* -- Courses Section -- */}
        <section id="courses">
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
