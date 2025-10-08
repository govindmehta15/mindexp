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

function MentorForm() {
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
            description: 'Please log in to become a mentor.',
            variant: 'destructive'
        });
        const redirect = searchParams.get('redirect') || '/mentor';
        router.push(`/login?redirect=${redirect}`);
        return null;
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Add logic to save application to Firestore
        toast({
            title: 'Application Submitted!',
            description: `Thank you for your interest in becoming a mentor. We'll be in touch soon.`,
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
                    <CardTitle className="font-headline text-2xl pt-4">Become a Mentor</CardTitle>
                    <CardDescription>Empower students globally by sharing your experience and guidance.</CardDescription>
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
                                <Label htmlFor="linkedin">LinkedIn / Portfolio (Optional)</Label>
                                <Input id="linkedin" placeholder="https://linkedin.com/in/..." />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" placeholder="Your country" required />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="expertise">Area of Expertise</Label>
                            <Input id="expertise" placeholder="e.g., Career Advice, Web Development, Psychology" required />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="experience">Years of Experience (Optional)</Label>
                                <Input id="experience" type="number" placeholder="e.g., 5" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="availability">Availability</Label>
                                <Select required>
                                    <SelectTrigger id="availability">
                                        <SelectValue placeholder="Select your availability" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1-2-weekly">1-2 hours / week</SelectItem>
                                        <SelectItem value="1-2-monthly">1-2 hours / month</SelectItem>
                                        <SelectItem value="project">Project-based</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                         <div className="space-y-2">
                           <Label htmlFor="motivation">Motivation / Message (Optional)</Label>
                           <Textarea 
                                id="motivation"
                                placeholder="Why would you like to mentor students?"
                                rows={4}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="consent" required />
                            <Label htmlFor="consent" className="text-sm font-normal">I agree to the mentor guidelines and code of conduct.</Label>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Become a Mentor</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default function MentorPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <MentorForm />
        </Suspense>
    );
}
