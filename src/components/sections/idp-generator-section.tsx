
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { handleGenerateIdp } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Generating...' : 'Generate My IDP'}
    </Button>
  );
}

export default function IdpGeneratorSection() {
  const initialState = { message: '', success: false };
  const [state, dispatch] = useFormState(handleGenerateIdp, initialState);

  return (
    <section id="demo" className="py-20 sm:py-32 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Try Our AI In Action</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Fill out the form below to generate a sample Individual Development Plan.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <Card>
            <CardHeader>
              <CardTitle>Employee Details</CardTitle>
              <CardDescription>Provide some basic information to personalize the IDP.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={dispatch} className="space-y-4">
                <div>
                  <Label htmlFor="employeeRole">Employee Role</Label>
                  <Input id="employeeRole" name="employeeRole" placeholder="e.g., Software Engineer" required />
                </div>
                <div>
                  <Label htmlFor="performanceData">Performance Data</Label>
                  <Textarea id="performanceData" name="performanceData" placeholder="e.g., Exceeds expectations in coding, needs improvement in project leadership." required />
                </div>
                <div>
                  <Label htmlFor="careerAspirations">Career Aspirations</Label>
                  <Textarea id="careerAspirations" name="careerAspirations" placeholder="e.g., Aspires to become a Tech Lead within 2 years." required />
                </div>
                <SubmitButton />
              </form>
            </CardContent>
          </Card>
          <Card className="min-h-[400px]">
            <CardHeader>
              <CardTitle>Generated Individual Development Plan</CardTitle>
            </CardHeader>
            <CardContent>
              {state.success && state.data ? (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {state.data.idp.split('\n').map((line, index) => {
                    if (line.includes('**')) {
                       const parts = line.split('**');
                       return <p key={index}><strong>{parts[1]}</strong>{parts[2]}</p>
                    }
                    return <p key={index}>{line}</p>;
                  })}
                </div>
              ) : (
                <div className="text-center text-muted-foreground pt-10">
                  <p>Your personalized IDP will appear here.</p>
                </div>
              )}
              {!state.success && state.message && (
                <Alert variant="destructive" className="mt-4">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
