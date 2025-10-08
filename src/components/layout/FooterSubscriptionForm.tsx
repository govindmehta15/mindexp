
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { FirebaseError } from 'firebase/app';

const SubscriptionSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type SubscriptionFormValues = z.infer<typeof SubscriptionSchema>;

export function FooterSubscriptionForm() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubscriptionFormValues>({
    resolver: zodResolver(SubscriptionSchema),
  });

  const onSubmit: SubmitHandler<SubscriptionFormValues> = async (data) => {
    if (!firestore) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not connect to the database. Please try again later.',
        });
        return;
    }

    setIsLoading(true);
    try {
      const subscriptionsRef = collection(firestore, 'subscriptions');
      await addDoc(subscriptionsRef, {
        email: data.email,
        subscribedAt: serverTimestamp(),
      });
      
      setIsSubmitted(true);
      reset();
    } catch (error) {
      console.error('Subscription error:', error);
       toast({
        variant: 'destructive',
        title: 'Subscription Failed',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isSubmitted) {
      return (
          <p className="text-green-600 font-medium">Thank you for subscribing!</p>
      )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          className="flex-1"
          {...register('email')}
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            'Subscribe'
          )}
        </Button>
      </div>
      {errors.email && (
        <p className="text-sm text-destructive">{errors.email.message}</p>
      )}
    </form>
  );
}
