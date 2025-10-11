'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, MessageSquare, Compass, Rocket, CalendarCheck2, User } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const careerPath = [
  {
    role: 'Software Engineer',
    status: 'completed',
  },
  {
    role: 'Senior Engineer',
    status: 'current',
  },
  {
    role: 'Tech Lead',
    status: 'next',
  },
  {
    role: 'Engineering Manager',
    status: 'next',
  },
];

const Node = ({ role, status, isLast }: { role: string; status: string; isLast: boolean }) => {
    const statusStyles = {
        completed: 'bg-primary/20 border-primary text-primary-foreground',
        current: 'bg-accent/20 border-accent text-accent-foreground scale-110 shadow-lg shadow-accent/20',
        next: 'bg-secondary border-border',
    };

    return (
        <div className="relative flex-1 min-w-[10rem]">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div
                        className={`rounded-lg p-4 text-center transition-all duration-300 ${statusStyles[status as keyof typeof statusStyles]}`}
                        >
                        <h4 className="font-semibold">{role}</h4>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{role}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {!isLast && (
                <div className="absolute top-1/2 left-full h-0.5 w-full bg-border -translate-y-1/2" />
            )}
        </div>
    );
};

function EmployeeDashboardContent() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  if (isUserLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-2xl font-semibold">Employee Dashboard</h1>
        </header>
        <main className="flex-1 space-y-8 p-4 sm:px-6 sm:py-0">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Profile Summary */}
                <Card className="md:col-span-1">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={`https://picsum.photos/seed/${user.uid}/100/100`} />
                            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-xl">{(user.displayName) || user.email}</CardTitle>
                            <CardDescription>Software Engineer</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h3 className="font-semibold mb-2 flex items-center"><User className="mr-2 h-4 w-4"/>Skills</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge>TypeScript</Badge>
                            <Badge>React</Badge>
                            <Badge>Node.js</Badge>
                            <Badge variant="secondary">Leadership</Badge>
                        </div>
                         <h3 className="font-semibold mb-2 flex items-center"><Rocket className="mr-2 h-4 w-4"/>Current Learning Goals</h3>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                            <li>Master Advanced TypeScript</li>
                            <li>Lead a project feature</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Recommended Courses */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center"><Compass className="mr-2 h-5 w-5"/>Recommended Courses</CardTitle>
                        <CardDescription>Courses or training based on current skill gap.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                           <div>
                               <p className="font-semibold">Advanced TypeScript for Enterprise</p>
                               <p className="text-sm text-muted-foreground">Udemy</p>
                           </div>
                           <Button variant="outline" size="sm" asChild>
                               <a href="#" target="_blank">View <ExternalLink className="ml-2 h-3 w-3" /></a>
                           </Button>
                       </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                           <div>
                               <p className="font-semibold">Microservices with Node.js and React</p>
                               <p className="text-sm text-muted-foreground">Coursera</p>
                           </div>
                           <Button variant="outline" size="sm" asChild>
                               <a href="#" target="_blank">View <ExternalLink className="ml-2 h-3 w-3" /></a>
                           </Button>
                       </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                           <div>
                               <p className="font-semibold">The Complete Guide to Project Leadership</p>
                               <p className="text-sm text-muted-foreground">LinkedIn Learning</p>
                           </div>
                           <Button variant="outline" size="sm" asChild>
                               <a href="#" target="_blank">View <ExternalLink className="ml-2 h-3 w-3" /></a>
                           </Button>
                       </div>
                    </CardContent>
                </Card>
            </div>

            {/* Learning Progress Tracker */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><CalendarCheck2 className="mr-2 h-5 w-5" />Learning Progress Tracker</CardTitle>
                    <CardDescription>Completion status and deadlines.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <p className="font-medium">Advanced TypeScript</p>
                            <p className="text-muted-foreground">75% | Deadline: 2 weeks</p>
                        </div>
                        <Progress value={75} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <p className="font-medium">Agile Project Management</p>
                            <p className="text-muted-foreground">40% | Deadline: 1 month</p>
                        </div>
                        <Progress value={40} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <p className="font-medium">Public Speaking Workshop</p>
                            <p className="text-muted-foreground">90% | Completed</p>
                        </div>
                        <Progress value={90} />
                    </div>
                </CardContent>
            </Card>

            {/* Career Path Visualizer */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><Rocket className="mr-2 h-5 w-5"/>Career Path Visualizer</CardTitle>
                    <CardDescription>Interactive flowchart showing potential career progressions.</CardDescription>
                </CardHeader>
                <CardContent className="relative py-12">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-0 overflow-x-auto pb-8 -mb-8">
                        {careerPath.map((node, index) => (
                        <Node
                            key={node.role}
                            role={node.role}
                            status={node.status}
                            isLast={index === careerPath.length - 1}
                        />
                        ))}
                    </div>
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-border -translate-y-1/2 -z-10 hidden md:block" />
                </CardContent>
            </Card>

            {/* Manager Feedback */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><MessageSquare className="mr-2 h-5 w-5"/>Manager Feedback</CardTitle>
                    <CardDescription>Feedback or comments from your reporting manager.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-secondary rounded-lg">
                        <Avatar>
                            <AvatarImage src="https://picsum.photos/seed/manager/100/100" />
                            <AvatarFallback>M</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">Jane Doe (Manager)</p>
                            <p className="text-sm text-muted-foreground">Posted 2 days ago</p>
                            <p className="mt-2">Great progress on the TypeScript course! Let's chat next week about identifying opportunities to apply those new skills in our upcoming sprint.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}

export default function EmployeeDashboard() {
    return (
        <FirebaseClientProvider>
            <EmployeeDashboardContent />
        </FirebaseClientProvider>
    )
}
