
'use client';
import { Button } from '@/components/ui/button';
import { FirebaseClientProvider, useUser, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Plus, TrendingUp, Home, Star, FileText, Lightbulb, Book, LogOut, Menu, Milestone, ChevronRight, Calendar, User, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getAuth, signOut } from 'firebase/auth';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateIdpDialog } from '@/components/idp/create-idp-dialog';
import { collection, query, where, getFirestore, doc } from 'firebase/firestore';
import type { IndividualDevelopmentPlan } from '@/types/idp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme-toggle';

function MyIdpContent() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = getAuth();
  const { toast } = useToast();

  const firestore = getFirestore();

  const idpsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'individual_development_plans'), where('employeeId', '==', user.uid));
  }, [firestore, user]);

  const { data: idpItems, isLoading: idpsLoading, error } = useCollection<IndividualDevelopmentPlan>(idpsQuery);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useAuthGuard();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleDeleteIdp = async (idpId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'individual_development_plans', idpId);
    try {
        deleteDocumentNonBlocking(docRef);
        toast({
            title: 'IDP Removed',
            description: 'The Individual Development Plan has been successfully removed.',
        });
    } catch (error) {
        console.error("Error removing document: ", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'There was a problem removing the IDP.',
        });
    }
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
          <Milestone className="h-5 w-5" /> My IDP
      </Link>
      <Link href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <Lightbulb className="h-5 w-5" /> Recommendations
      </Link>
      <Link href="/employee/courses" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <Book className="h-5 w-5" /> Courses
      </Link>
    </>
  );

  const loading = isUserLoading || idpsLoading;

  return (
    <>
      <CreateIdpDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="flex min-h-dvh w-full flex-col bg-muted/10">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="#" className="flex items-center gap-2 font-semibold text-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span>IDP System</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">{user?.displayName || user?.email}</span>
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-0 sm:mr-2 h-4 w-4" /><span className="hidden sm:inline">Logout</span>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <nav className="grid gap-6 text-lg font-medium mt-8">
                  <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
                    <TrendingUp className="h-6 w-6" />
                    <span>IDP System</span>
                  </Link>
                  <NavLinks />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 p-6 rounded-xl shadow-inner mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Milestone className="h-8 w-8 text-blue-400" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                  My Individual Development Plans
                </h1>
              </div>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create New IDP
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : error ? (
            <p className="text-destructive text-center">Error loading IDPs</p>
          ) : (
            <div className="space-y-4">
              {idpItems && idpItems.length > 0 ? (
                idpItems.map((item) => (
                  <Card key={item.id} className='hover:shadow-md transition-shadow'>
                    <CardHeader>
                      <CardTitle className='flex justify-between items-center'>
                        {item.title}
                        <div className="flex items-center gap-2">
                           <Badge variant={item.status === 'Completed' ? 'secondary' : 'default'}>{item.status}</Badge>
                           <Button variant="ghost" size="icon" onClick={() => handleDeleteIdp(item.id)}>
                              <Trash2 className="h-5 w-5 text-destructive" />
                           </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <p className='text-muted-foreground'>{item.description}</p>
                        <div className='flex flex-wrap gap-4 text-sm'>
                            <div className='flex items-center gap-2'>
                                <User className='h-4 w-4 text-primary'/>
                                <strong>Target Role:</strong> {item.targetRole}
                            </div>
                             <div className='flex items-center gap-2'>
                                <Calendar className='h-4 w-4 text-primary'/>
                                <strong>Target Date:</strong> {format(new Date(item.endDate), 'PPP')}
                            </div>
                        </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-10">
                    <p>No IDPs found. Create one to get started!</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default function MyIdpPage() {
  return (
    <FirebaseClientProvider>
      <MyIdpContent />
    </FirebaseClientProvider>
  );
}
