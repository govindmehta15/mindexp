
'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { collection, serverTimestamp } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

function MentorForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitted, setIsSubmitted] = useState(false);

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
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const applicationData = {
            userId: user.uid,
            fullName: data.fullName,
            email: data.email,
            linkedin: data.linkedin,
            country: data.country,
            expertise: data.expertise,
            experience: data.experience ? Number(data.experience) : null,
            availability: data.availability,
            motivation: data.motivation,
            status: 'submitted',
            submittedAt: serverTimestamp(),
        };

        const applicationsRef = collection(firestore, 'mentor_applications');
        await addDocumentNonBlocking(applicationsRef, applicationData);

        toast({
            title: 'Application Submitted!',
            description: `Thank you for your interest in becoming a mentor. We'll be in touch soon.`,
        });
        setIsSubmitted(true);
    };

    if(isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/80 to-green-300/80 py-12 px-4 text-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                >
                    <Card className="w-full max-w-md p-8">
                        <CardHeader className="items-center">
                            <div className="bg-green-100 p-3 rounded-full mb-4">
                                <CheckCircle className="h-12 w-12 text-green-600" />
                            </div>
                            <CardTitle className="font-headline text-2xl">Thanks, {user.displayName}!</CardTitle>
                            <CardDescription>Your mentor application is under review. You’ll hear from us soon.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Button asChild><Link href="/community">Back to Community</Link></Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="bg-background">
            <section className="py-20 bg-gradient-to-br from-primary/80 to-green-300/80 text-white">
                <div className="container mx-auto text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Become a mentor and empower students globally.</h1>
                </div>
            </section>
            
            <section className="flex justify-center items-center py-12 px-4">
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
                                    <Label htmlFor="linkedin">LinkedIn / Portfolio (Optional)</Label>
                                    <Input name="linkedin" id="linkedin" placeholder="https://linkedin.com/in/..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input name="country" id="country" placeholder="Your country" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expertise">Profession / Area of Expertise</Label>
                                <Input name="expertise" id="expertise" placeholder="e.g., Career Advice, Web Development, Psychology" required />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="experience">Years of Mentoring Experience</Label>
                                    <Input name="experience" id="experience" type="number" placeholder="e.g., 5" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="availability">Availability</Label>
                                    <Select name="availability" required>
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
                                    name="motivation"
                                    id="motivation"
                                    placeholder="Why would you like to mentor students?"
                                    rows={4}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="resume">Upload Resume (Optional)</Label>
                                <Input name="resume" id="resume" type="file" />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="consent" required />
                                <Label htmlFor="consent" className="text-sm font-normal">I agree to the mentor guidelines and code of conduct.</Label>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">Apply as Mentor</Button>
                        </CardFooter>
                    </form>
                </Card>
            </section>
            
            <section className="py-16 bg-muted/50">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold font-headline mb-8">Meet Some of Our Mentors</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Dr. Anya Sharma', title: 'Clinical Psychologist', expertise: '#Anxiety #Wellness', since: '2023', quote: 'Helping students thrive with clarity.', avatar: 'https://picsum.photos/seed/m1/100/100' },
                            { name: 'Leo Chen', title: 'Senior Software Engineer', expertise: '#Career #Tech', since: '2024', quote: 'Navigating the tech industry.', avatar: 'https://picsum.photos/seed/m2/100/100' },
                            { name: 'Dr. Ben Carter', title: 'Wellness Researcher', expertise: '#Research #Wellbeing', since: '2023', quote: 'Data-driven self-improvement.', avatar: 'https://picsum.photos/seed/m3/100/100' }
                        ].map(mentor => (
                            <Card key={mentor.name} className="p-6 text-center hover:shadow-xl transition-shadow">
                                <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-primary">
                                    <AvatarImage src={mentor.avatar} />
                                    <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                                </Avatar>
                                <h3 className="font-bold font-headline text-lg">{mentor.name}</h3>
                                <p className="text-sm text-primary">{mentor.title}</p>
                                <p className="text-sm text-muted-foreground mt-1">{mentor.expertise}</p>
                                <p className="text-xs text-muted-foreground mt-2">Mentoring since {mentor.since}</p>
                                <blockquote className="mt-4 border-l-2 border-primary pl-3 text-left italic text-sm">
                                    "{mentor.quote}"
                                </blockquote>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
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

    