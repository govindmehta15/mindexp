'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

function JoinStudyForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isUserLoading } = useUser();
    const { toast } = useToast();

    if (isUserLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    if (!user) {
        toast({
            title: 'Authentication Required',
            description: 'Please log in to join a study.',
            variant: 'destructive'
        });
        const redirect = searchParams.get('redirect') || '/join-study';
        router.push(`/login?redirect=${redirect}`);
        return null;
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Add logic to save application to Firestore
        toast({
            title: 'Application Submitted!',
            description: `Your request to join the study program has been sent.`,
        });
        router.push('/');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-muted/50 py-12 px-4">
            <Card className="w-full max-w-2xl">
                 <CardHeader>
                    <Button variant="ghost" size="sm" className="justify-self-start w-fit" asChild>
                        <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
                    </Button>
                    <CardTitle className="font-headline text-2xl pt-4">Join Global Study Program</CardTitle>
                    <CardDescription>Collaborate, Learn, and Contribute to Global Student Research & Mental Wellbeing.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="full-name">Full Name</Label>
                                <Input id="full-name" placeholder="Your full name" defaultValue={user.displayName || ''} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="Your email" defaultValue={user.email || ''} required />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="institution">Institution / University</Label>
                                <Input id="institution" placeholder="Your institution" required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" placeholder="Your country" required />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="area-of-study">Area of Study / Interest</Label>
                            <Input id="area-of-study" placeholder="e.g., Psychology, Computer Science" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="availability">Availability</Label>
                             <Select required>
                                <SelectTrigger id="availability">
                                    <SelectValue placeholder="Select your availability" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                           <Label htmlFor="reason-to-join">Reason to Join</Label>
                           <Textarea 
                                id="reason-to-join"
                                placeholder="Tell us why you are interested in joining this study program..."
                                rows={5}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="resume">Upload Resume / Profile (Optional)</Label>
                            <Input id="resume" type="file" />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="consent" required />
                            <Label htmlFor="consent" className="text-sm font-normal">I consent to my data being used for the purpose of this study application.</Label>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Join Study Program</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default function JoinStudyPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <JoinStudyForm />
        </Suspense>
    );
}
