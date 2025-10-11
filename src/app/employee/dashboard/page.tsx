'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import React from 'react';
import { TrendingUp, Home, Star, FileText, Lightbulb, Book, LogOut } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import Link from 'next/link';
import { getAuth, signOut } from 'firebase/auth';

const skillData = [
  { name: 'technical', value: 75 },
  { name: 'soft', value: 25 },
];
const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))'];

function EmployeeDashboardContent() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = getAuth();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
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
          <Link href="/employee/dashboard" className="flex items-center gap-2 text-primary">
            <Button variant="ghost" size="icon" className='bg-primary/10'><Home className="h-5 w-5" /></Button> Dashboard
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
          <Link href="/employee/courses" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <Book className="h-5 w-5" /> Courses
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <span>{user.displayName || user.email}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 grid gap-6 md:grid-cols-2">
        <Card>
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

        <Card>
           <CardContent className="p-0">
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
                    const { color } = entry;
                    const item = skillData.find(d => d.name === value);
                    return <span style={{ color: "var(--foreground)" }}>{value} ({item?.value}%)</span>;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
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
