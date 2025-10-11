
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { TrendingUp, Home, Star, FileText, Lightbulb, Book, LogOut, Menu } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import Link from 'next/link';
import { getAuth, signOut } from 'firebase/auth';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuthGuard } from '@/hooks/use-auth-guard';

const skillData = [
  { name: 'technical', value: 75 },
  { name: 'soft', value: 25 },
];
const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))'];

function EmployeeDashboardContent() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = getAuth();
  const [isClient, setIsClient] = useState(false);

  useAuthGuard();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (isUserLoading || !user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const NavLinks = () => (
    <>
      <Link href="/employee/dashboard" className="flex items-center gap-2 text-primary font-semibold">
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
      <Link href="/employee/courses" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <Book className="h-5 w-5" /> Courses
      </Link>
    </>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="#" className="flex items-center gap-2 font-semibold">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span>TalentFlow</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <NavLinks />
        </nav>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">{user.displayName || user.email}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-0 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
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

      <main className="flex-1 p-4 sm:p-6 grid gap-4 sm:gap-6 md:grid-cols-2">
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
