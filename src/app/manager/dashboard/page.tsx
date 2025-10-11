'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Activity } from 'lucide-react';

const teamData = [
  { name: 'Alice', progress: 75, idpStatus: 'On Track' },
  { name: 'Bob', progress: 40, idpStatus: 'Needs Attention' },
  { name: 'Charlie', progress: 90, idpStatus: 'Exceeding' },
  { name: 'David', progress: 60, idpStatus: 'On Track' },
]

const skillData = [
  { skill: 'TypeScript', level: 70 },
  { skill: 'React', level: 85 },
  { skill: 'Node.js', level: 60 },
  { skill: 'DevOps', level: 45 },
  { skill: 'SQL', level: 75 },
];


function ManagerDashboardContent() {
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
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-xl font-semibold">Manager Dashboard</h1>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                  <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teamData.length}</div>
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
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Team IDP Tracking</CardTitle>
                  <CardDescription>Monitor the development progress of your team.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamData.map((member) => (
                        <TableRow key={member.name}>
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
              <Card className="col-span-4 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Team Skill Analytics</CardTitle>
                  <CardDescription>Current skill distribution in your team.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={skillData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="skill" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="level" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
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
