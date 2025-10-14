
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { TrendingUp, Eye, EyeOff, AtSign, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FirebaseClientProvider } from '@/firebase/client-provider';

function LoginPageContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth();
  const db = getFirestore();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check user role
      const employeeDoc = await getDoc(doc(db, 'employees', user.uid));
      if (employeeDoc.exists()) {
        router.push('/employee/dashboard');
        return;
      }

      const managerDoc = await getDoc(doc(db, 'managers', user.uid));
      if (managerDoc.exists()) {
        router.push('/manager/dashboard');
        return;
      }

      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (adminDoc.exists()) {
        router.push('/admin/dashboard');
        return;
      }

      toast({
        variant: 'destructive',
        title: 'Login Error',
        description: 'No role assigned for this user.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Error',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
       <div className="grid lg:grid-cols-2 max-w-6xl w-full mx-auto rounded-xl overflow-hidden shadow-2xl">

        <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gray-800 text-white text-center">
            <TrendingUp className="h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl font-bold">TalentFlow AI</h1>
            <p className="mt-4 text-gray-300">Empower Growth with Intelligent IDP Recommendations.</p>
        </div>

        <Card className="rounded-none lg:rounded-l-none border-0">
            <CardHeader className="text-center pt-12">
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Enter your email below to login to your account</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSignIn} className="grid gap-6">
                <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                    />
                </div>
                </div>
                <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                    </Link>
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                    </Button>
                </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
                </Button>
            </form>
            <div className="mt-6 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="underline font-semibold">
                Sign up
                </Link>
            </div>
            </CardContent>
        </Card>
       </div>
    </div>
  );
}

export default function LoginPage() {
    return (
        <FirebaseClientProvider>
            <LoginPageContent />
        </FirebaseClientProvider>
    )
}
