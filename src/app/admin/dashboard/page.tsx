'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import React from 'react';

function AdminDashboardContent() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user.displayName || user.email}!</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This is the admin dashboard. Here you can manage users, view company-wide analytics, and more.</p>
            </CardContent>
          </Card>
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
