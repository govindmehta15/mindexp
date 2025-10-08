
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth, initiateEmailSignUp, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';

const registerSchema = z.object({
  displayName: z.string().min(2, { message: 'Display name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  universityAffiliation: z.string().min(2, { message: 'Please enter your university.' }),
  role: z.enum(['student', 'professional', 'researcher']),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterFormComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const roleFromQuery = searchParams.get('role') || 'student';

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      universityAffiliation: '',
      role: ['student', 'professional', 'researcher'].includes(roleFromQuery) ? roleFromQuery as 'student' | 'professional' | 'researcher' : 'student',
    },
  });

  useEffect(() => {
    const role = searchParams.get('role');
    if (role && ['student', 'professional', 'researcher'].includes(role)) {
      form.setValue('role', role as 'student' | 'professional' | 'researcher');
    }
  }, [searchParams, form]);


  const handleSignup = async (values: RegisterFormValues) => {
    setIsLoading(true);

    try {
      const userCredential = await initiateEmailSignUp(auth, values.email, values.password);
      
      // After user is created, save their info to Firestore
      if (userCredential && userCredential.user) {
        const userRef = doc(firestore, 'users', userCredential.user.uid);
        const userData = {
          displayName: values.displayName,
          email: values.email,
          universityAffiliation: values.universityAffiliation,
          role: values.role,
          createdAt: serverTimestamp(),
        };
        // This is a non-blocking write
        setDocumentNonBlocking(userRef, userData, { merge: true });
      }

      toast({
        title: 'Signup Successful',
        description: "Welcome! You're now logged in.",
      });
      router.push('/community');
    } catch (error) {
      console.error(error);
      let errorMessage = 'An unexpected error occurred.';
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already associated with an account.';
            break;
          case 'auth/weak-password':
            errorMessage = 'The password is too weak. Please use at least 6 characters.';
            break;
          default:
            errorMessage = 'Failed to create an account. Please try again.';
            break;
        }
      }
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/50 py-12">
      <Card className="mx-auto max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Join MindExp</CardTitle>
          <CardDescription>
            Create your account to join a global community of students and professionals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignup)} className="grid gap-4">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="universityAffiliation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University / Institution</FormLabel>
                    <FormControl>
                      <Input placeholder="State University" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I am a...</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="professional">Mental Health Professional</SelectItem>
                        <SelectItem value="researcher">Researcher / Educator</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterFormComponent />
    </Suspense>
  );
}
