
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Trash2, PlusCircle, TrendingUp, Home, Star, FileText, Lightbulb, Book, LogOut } from 'lucide-react';
import Link from 'next/link';
import { getAuth, signOut } from 'firebase/auth';

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

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6">
        <div className="flex items-center gap-4">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">IDP System</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/employee/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <Home className="h-5 w-5" /> Dashboard
          </Link>
          <Link href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <Star className="h-5 w-5" /> Skills
          </Link>
          <Link href="/employee/my-idp" className="flex items-center gap-2 text-primary">
             <Button variant="ghost" size="icon" className='bg-primary/10'><FileText className="h-5 w-5" /></Button> My IDP
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

      <main className="flex-1 p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>My Individual Development Plan</CardTitle>
                <CardDescription>Your personal goals for career growth.</CardDescription>
            </div>
            <Button onClick={addItem}><PlusCircle className='mr-2 h-4 w-4'/>Add Goal</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {idpItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                  <p className="font-medium">{item.text}</p>
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
