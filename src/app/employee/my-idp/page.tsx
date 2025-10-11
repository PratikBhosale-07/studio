
'use client';
import { Button } from '@/components/ui/button';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Plus, TrendingUp, Home, Star, FileText, Lightbulb, Book, LogOut, Menu, Road } from 'lucide-react';
import Link from 'next/link';
import { getAuth, signOut } from 'firebase/auth';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';

const initialIdpItems: any[] = [];

function MyIdpContent() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = getAuth();
  const [idpItems, setIdpItems] = useState(initialIdpItems);
  const [error, setError] = useState("Error loading IDPs");
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const NavLinks = ({isMobile = false} : {isMobile?: boolean}) => (
    <>
      <Button asChild variant={isMobile ? "ghost" : "link"} className="text-muted-foreground hover:text-foreground justify-start">
        <Link href="/employee/dashboard" className="flex items-center gap-2">
          <Home className="h-5 w-5" /> Dashboard
        </Link>
      </Button>
      <Button asChild variant={isMobile ? "ghost" : "link"} className="text-muted-foreground hover:text-foreground justify-start">
        <Link href="#" className="flex items-center gap-2">
          <Star className="h-5 w-5" /> Skills
        </Link>
      </Button>
      <Button asChild variant="default" className='justify-start'>
        <Link href="/employee/my-idp" className="flex items-center gap-2">
          <Road className="h-5 w-5" /> My IDP
        </Link>
      </Button>
      <Button asChild variant={isMobile ? "ghost" : "link"} className="text-muted-foreground hover:text-foreground justify-start">
        <Link href="#" className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" /> Recommendations
        </Link>
      </Button>
      <Button asChild variant={isMobile ? "ghost" : "link"} className="text-muted-foreground hover:text-foreground justify-start">
        <Link href="/employee/courses" className="flex items-center gap-2">
          <Book className="h-5 w-5" /> Courses
        </Link>
      </Button>
    </>
  );
  
  return (
    <div className="flex min-h-dvh w-full flex-col bg-muted/10">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="#" className="flex items-center gap-2 font-semibold text-lg">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span>IDP System</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
          <NavLinks />
        </nav>
        <div className="flex items-center gap-4">
           {isUserLoading ? (
            <span className='hidden sm:inline'>Loading...</span>
          ) : user ? (
            <span className='hidden sm:inline'>{user.displayName || user.email}</span>
          ) : null}
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
              <nav className="grid gap-4 text-base font-medium">
                 <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <TrendingUp className="h-6 w-6" />
                  <span>IDP System</span>
                </Link>
                <NavLinks isMobile/>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6">
        <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 p-6 rounded-xl shadow-inner mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className='flex items-center gap-4'>
                    <div className='p-3 bg-blue-500/20 rounded-lg'>
                        <Road className="h-8 w-8 text-blue-400" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                        My Individual Development Plans
                    </h1>
                </div>
                <Button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105">
                    <Plus className="mr-2 h-5 w-5" />
                    Create New IDP
                </Button>
            </div>
        </div>

        {loading ? (
            <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
        ) : error ? (
            <p className="text-destructive text-center">{error}</p>
        ) : (
             <div className="space-y-4">
                {idpItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                    <p className="font-medium text-sm sm:text-base">{item.text}</p>
                    </div>
                ))}
            </div>
        )}

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
