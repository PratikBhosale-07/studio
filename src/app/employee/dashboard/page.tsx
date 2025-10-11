'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FileText, Lightbulb, TrendingUp } from 'lucide-react';

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
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-xl font-semibold">Employee Dashboard</h1>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">My Development Plan</CardTitle>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">IDP In Progress</div>
                <p className="text-xs text-muted-foreground">Updated 2 weeks ago</p>
                <Button className="mt-4">View My IDP</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">AI Recommendations</CardTitle>
                <Lightbulb className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3 New Skills</div>
                <p className="text-xs text-muted-foreground">Based on your career goals</p>
                <Button variant="outline" className="mt-4">Explore Skills</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
                 <Progress value={68} className="mt-4" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Current Learning Progress</CardTitle>
                <CardDescription>Your active skill development tracks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="font-medium">Advanced TypeScript</p>
                    <p className="text-muted-foreground">75%</p>
                  </div>
                  <Progress value={75} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="font-medium">Agile Project Management</p>
                    <p className="text-muted-foreground">40%</p>
                  </div>
                  <Progress value={40} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="font-medium">Public Speaking Workshop</p>
                    <p className="text-muted-foreground">90%</p>
                  </div>
                  <Progress value={90} />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
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
