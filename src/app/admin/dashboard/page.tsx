'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Target, Briefcase } from 'lucide-react';

const overallStats = [
    { name: 'Total Users', value: '1,420', icon: <Users className="w-4 h-4 text-muted-foreground" /> },
    { name: 'Active IDPs', value: '1,120', icon: <Target className="w-4 h-4 text-muted-foreground" /> },
    { name: 'Departments', value: '15', icon: <Briefcase className="w-4 h-4 text-muted-foreground" /> },
]

const engagementData = [
  { name: 'Q1', engagement: 65 },
  { name: 'Q2', engagement: 72 },
  { name: 'Q3', engagement: 78 },
  { name: 'Q4', engagement: 85 },
];

const roleDistributionData = [
  { name: 'Employees', value: 1200 },
  { name: 'Managers', value: 200 },
  { name: 'Admins', value: 20 },
];
const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];


function AdminDashboardContent() {
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
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Update Datasets
          </Button>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid gap-4 md:grid-cols-3">
             {overallStats.map(stat => (
                 <Card key={stat.name}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                        {stat.icon}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                 </Card>
             ))}
          </div>
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>User Engagement Over Time</CardTitle>
                   <CardDescription>Platform engagement trends across quarters.</CardDescription>
                </CardHeader>
                <CardContent>
                   <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={engagementData}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <Bar dataKey="engagement" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                   </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="col-span-4 lg:col-span-3">
                 <CardHeader>
                    <CardTitle>Role Distribution</CardTitle>
                    <CardDescription>Breakdown of user roles in the system.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={roleDistributionData} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {roleDistributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                 </CardContent>
              </Card>
           </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
    return (
        <FirebaseClientProvider>
            <AdminDashboardContent />
        </FirebaseClientProvider>
    )
}
