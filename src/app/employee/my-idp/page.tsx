
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Trash2, PlusCircle, TrendingUp, Home, Star, FileText, Lightbulb, Book, LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { getAuth, signOut } from 'firebase/auth';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

const initialIdpItems = [
  { id: 1, text: 'Complete Advanced TypeScript Course' },
  { id: 2, text: 'Lead a feature development in a project' },
  { id: 3, text: 'Mentor a junior developer' },
];

function MyIdpContent() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = getAuth();
  const [idpItems, setIdpItems] = useState(initialIdpItems);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const removeItem = (id: number) => {
    setIdpItems(idpItems.filter(item => item.id !== id));
  };
  
  const addItem = () => {
    const newId = idpItems.length > 0 ? Math.max(...idpItems.map(item => item.id)) + 1 : 1;
    const newItem = { id: newId, text: `New Development Goal ${newId}` };
    setIdpItems([...idpItems, newItem]);
  };


  if (isUserLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }
  
  const NavLinks = () => (
    <>
      <Link href="/employee/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <Home className="h-5 w-5" /> Dashboard
      </Link>
      <Link href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <Star className="h-5 w-5" /> Skills
      </Link>
      <Link href="/employee/my-idp" className="flex items-center gap-2 text-primary font-semibold">
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
          <span className='hidden sm:inline'>{user.displayName || user.email}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-0 sm:mr-2 h-4 w-4" /><span className='hidden sm:inline'>Logout</span>
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

      <main className="flex-1 p-4 sm:p-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <CardTitle>My Individual Development Plan</CardTitle>
                <CardDescription>Your personal goals for career growth.</CardDescription>
            </div>
            <Button onClick={addItem} className='w-full sm:w-auto'><PlusCircle className='mr-2 h-4 w-4'/>Add Goal</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {idpItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                  <p className="font-medium text-sm sm:text-base">{item.text}</p>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function MyIdpPage() {
    return (
        <FirebaseClientProvider>
            <MyIdpContent />
        </FirebaseClientProvider>
    )
}
