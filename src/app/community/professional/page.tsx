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

function JoinProfessionalForm() {
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
            description: 'Please log in to join as a professional.',
            variant: 'destructive'
        });
        const redirect = searchParams.get('redirect') || '/community/professional';
        router.push(`/login?redirect=${redirect}`);
        return null;
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Add logic to save application to Firestore
        toast({
            title: 'Application Received!',
            description: `Thank you for your interest. We will review your application and be in touch.`,
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
                    <CardTitle className="font-headline text-2xl pt-4">Join as a Professional</CardTitle>
                    <CardDescription>Collaborate to shape the future of student wellbeing and academic growth.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="full-name">Full Name</Label>
                                <Input id="full-name" placeholder="Dr. Jane Doe" defaultValue={user.displayName || ''} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="Your email" defaultValue={user.email || ''} required />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="professional-title">Professional Title</Label>
                                <Input id="professional-title" placeholder="e.g., Clinical Psychologist" required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="organization">Institution / Organization</Label>
                                <Input id="organization" placeholder="Your organization" required />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" placeholder="Your country" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="experience">Years of Experience (Optional)</Label>
                                <Input id="experience" type="number" placeholder="e.g., 5" />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="expertise">Area of Expertise</Label>
                            <Input id="expertise" placeholder="e.g., CBT, Student Mental Health, Educational Tech" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="availability">Availability</Label>
                             <Select required>
                                <SelectTrigger id="availability">
                                    <SelectValue placeholder="Select your availability" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="project">Project-based collaboration</SelectItem>
                                    <SelectItem value="mentoring">Mentoring (1-2 hours/week)</SelectItem>
                                    <SelectItem value="speaking">Speaking / Webinars</SelectItem>
                                    <SelectItem value="advisory">Advisory Role</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                           <Label htmlFor="message">Message (Optional)</Label>
                           <Textarea 
                                id="message"
                                placeholder="Tell us about your interest in collaborating..."
                                rows={4}
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="certification">Upload Certification (Optional)</Label>
                            <Input id="certification" type="file" />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="consent" required />
                            <Label htmlFor="consent" className="text-sm font-normal">I consent to MindExp contacting me about collaboration opportunities.</Label>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Join as Professional</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default function JoinProfessionalPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <JoinProfessionalForm />
        </Suspense>
    );
}
