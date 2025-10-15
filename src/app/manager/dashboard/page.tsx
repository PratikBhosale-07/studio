
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Activity, ArrowLeft, LogOut } from 'lucide-react';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { Button } from '@/components/ui/button';
import { getAuth, signOut } from 'firebase/auth';
import { ThemeToggle } from '@/components/theme-toggle';

type Skill = {
  skill: string;
  level: number;
};

type TeamMember = {
  name: string;
  progress: number;
  idpStatus: 'On Track' | 'Needs Attention' | 'Exceeding';
  skills: Skill[];
};

const teamMembers: TeamMember[] = [
  { 
    name: 'Alice', 
    progress: 75, 
    idpStatus: 'On Track', 
    skills: [
      { skill: 'TypeScript', level: 85 },
      { skill: 'React', level: 90 },
      { skill: 'Node.js', level: 70 },
      { skill: 'DevOps', level: 60 },
      { skill: 'SQL', level: 80 },
    ]
  },
  { 
    name: 'Bob', 
    progress: 40, 
    idpStatus: 'Needs Attention',
    skills: [
      { skill: 'TypeScript', level: 60 },
      { skill: 'React', level: 70 },
      { skill: 'Node.js', level: 50 },
      { skill: 'DevOps', level: 30 },
      { skill: 'SQL', level: 65 },
    ]
  },
  { 
    name: 'Charlie', 
    progress: 90, 
    idpStatus: 'Exceeding',
    skills: [
      { skill: 'TypeScript', level: 95 },
      { skill: 'React', level: 92 },
      { skill: 'Node.js', level: 85 },
      { skill: 'DevOps', level: 75 },
      { skill: 'SQL', level: 90 },
    ]
  },
  { 
    name: 'David', 
    progress: 60, 
    idpStatus: 'On Track',
    skills: [
      { skill: 'TypeScript', level: 70 },
      { skill: 'React', level: 80 },
      { skill: 'Node.js', level: 65 },
      { skill: 'DevOps', level: 40 },
      { skill: 'SQL', level: 70 },
    ]
  },
];

const teamAverageSkills: Skill[] = [
  { skill: 'TypeScript', level: 78 },
  { skill: 'React', level: 84 },
  { skill: 'Node.js', level: 68 },
  { skill: 'DevOps', level: 51 },
  { skill: 'SQL', level: 76 },
];

function ManagerDashboardContent() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = getAuth();
  const [isClient, setIsClient] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useAuthGuard('/login');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleMemberSelect = (member: TeamMember) => {
    setSelectedMember(member);
  };

  const handleShowTeam = () => {
    setSelectedMember(null);
  };

  const chartData = selectedMember ? selectedMember.skills : teamAverageSkills;
  const chartTitle = selectedMember ? `${selectedMember.name}'s Skill Analytics` : 'Team Skill Analytics';
  const chartDescription = selectedMember ? `A breakdown of ${selectedMember.name}'s current skills.` : 'Current average skill distribution in your team.';

  if (isUserLoading || !user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-xl font-semibold">Manager Dashboard</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="hidden sm:inline">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                  <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teamMembers.length}</div>
                  <p className="text-xs text-muted-foreground">Direct reports</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">IDP Completion Rate</CardTitle>
                  <Target className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">72%</div>
                  <p className="text-xs text-muted-foreground">+5% this quarter</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Top Skill Gap</CardTitle>
                  <Activity className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">DevOps</div>
                  <p className="text-xs text-muted-foreground">Recommended training available</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-1 lg:col-span-4">
                <CardHeader>
                  <CardTitle>Team IDP Tracking</CardTitle>
                  <CardDescription>Monitor the development progress of your team.</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.map((member) => (
                        <TableRow key={member.name} onClick={() => handleMemberSelect(member)} className="cursor-pointer hover:bg-muted">
                          <TableCell>{member.name}</TableCell>
                          <TableCell>
                            <Progress value={member.progress} className="w-[100px]" />
                          </TableCell>
                          <TableCell>
                             <Badge variant={member.idpStatus === 'On Track' ? 'default' : member.idpStatus === 'Needs Attention' ? 'destructive' : 'secondary'}>{member.idpStatus}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{chartTitle}</CardTitle>
                      <CardDescription>{chartDescription}</CardDescription>
                    </div>
                    {selectedMember && (
                      <Button variant="ghost" size="sm" onClick={handleShowTeam}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Team
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isClient && (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="skill" type="category" width={80} />
                        <Tooltip
                            contentStyle={{
                                background: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                            }}
                        />
                        <Bar dataKey="level" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
        </main>
      </div>
    </div>
  );
}

export default function ManagerDashboard() {
    return (
        <FirebaseClientProvider>
            <ManagerDashboardContent />
        </FirebaseClientProvider>
    )
}

    