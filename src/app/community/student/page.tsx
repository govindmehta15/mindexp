
'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { collection, serverTimestamp } from 'firebase/firestore';

function JoinStudentForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
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
            description: 'Please log in to join the student community.',
            variant: 'destructive'
        });
        const redirect = searchParams.get('redirect') || '/community/student';
        router.push(`/login?redirect=${redirect}`);
        return null;
    }
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        const interests = Array.from(formData.keys()).filter(key => key.startsWith('interest-')).map(key => key.replace('interest-', ''));

        const applicationData = {
            userId: user.uid,
            fullName: data.fullName,
            email: data.email,
            institution: data.institution,
            country: data.country,
            fieldOfStudy: data.fieldOfStudy,
            interests: interests,
            motivation: data.motivation,
            status: 'submitted',
            submittedAt: serverTimestamp(),
        };
        
        const applicationsRef = collection(firestore, 'student_community_applications');
        await addDocumentNonBlocking(applicationsRef, applicationData);
        
        toast({
            title: 'Welcome to the Community!',
            description: `Your application has been submitted.`,
        });
        router.push('/community');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-muted/50 py-12 px-4">
            <Card className="w-full max-w-2xl">
                 <CardHeader>
                    <Button variant="ghost" size="sm" className="justify-self-start w-fit" asChild>
                        <Link href="/community"><ArrowLeft className="mr-2 h-4 w-4" />Back to Community</Link>
                    </Button>
                    <CardTitle className="font-headline text-2xl pt-4">Join the MindExp Student Community</CardTitle>
                    <CardDescription>Welcome! Fill out the form below to become a part of our global student network.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input name="fullName" id="fullName" placeholder="Your full name" defaultValue={user.displayName || ''} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input name="email" id="email" type="email" placeholder="Your email" defaultValue={user.email || ''} required />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="institution">Institution</Label>
                                <Input name="institution" id="institution" placeholder="Your institution" required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input name="country" id="country" placeholder="Your country" required />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="fieldOfStudy">Field of Study</Label>
                            <Input name="fieldOfStudy" id="fieldOfStudy" placeholder="e.g., Psychology, Computer Science" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Interests (Optional)</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Wellbeing', 'Career', 'AI', 'Research'].map(interest => (
                                    <div key={interest} className="flex items-center space-x-2">
                                        <Checkbox name={`interest-${interest.toLowerCase()}`} id={`interest-${interest.toLowerCase()}`} />
                                        <Label htmlFor={`interest-${interest.toLowerCase()}`} className="font-normal">{interest}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div className="space-y-2">
                           <Label htmlFor="motivation">Message / Motivation (Optional)</Label>
                           <Textarea 
                                name="motivation"
                                id="motivation"
                                placeholder="Tell us why you're excited to join..."
                                rows={4}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="consent" required />
                            <Label htmlFor="consent" className="text-sm font-normal">I agree to the community guidelines and terms of service.</Label>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Join the Community</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default function JoinStudentPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <JoinStudentForm />
        </Suspense>
    );
}
