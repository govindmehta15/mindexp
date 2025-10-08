
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
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { collection, serverTimestamp } from 'firebase/firestore';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

function JoinStudentForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (isUserLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
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

        const applicationData = {
            userId: user.uid,
            fullName: data.fullName,
            email: data.email,
            institution: data.institution,
            country: data.country,
            fieldOfStudy: data.fieldOfStudy,
            interests: [data.interests],
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
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 text-center">
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
                            <CardTitle className="font-headline text-2xl">Welcome aboard, {user.displayName}! 💫</CardTitle>
                            <CardDescription>You’re now part of MindExp’s student community.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                             <Button asChild><Link href="/community/circles">View Student Circles</Link></Button>
                             <Button variant="outline" asChild><Link href="/resources">Explore Resources</Link></Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="bg-background">
            <section className="py-20 bg-gradient-to-br from-[#60A5FA] to-[#A78BFA] text-white">
                <div className="container mx-auto text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Grow. Connect. Learn. Together. 🌱</h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto">
                        Join thousands of students improving their academic journey and mental well-being with us.
                    </p>
                    <Button variant="secondary" className="mt-8" onClick={() => document.getElementById('join-form')?.scrollIntoView({ behavior: 'smooth' })}>
                        Join the Community
                    </Button>
                </div>
            </section>
        
            <section id="join-form" className="flex justify-center items-center min-h-screen bg-muted/50 py-12 px-4">
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
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fieldOfStudy">Field of Study</Label>
                                    <Input name="fieldOfStudy" id="fieldOfStudy" placeholder="e.g., Psychology, Computer Science" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="interests">Areas of Interest</Label>
                                    <Select name="interests">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your main interest" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="academics">Academics</SelectItem>
                                            <SelectItem value="career">Career Growth</SelectItem>
                                            <SelectItem value="wellness">Mental Wellness</SelectItem>
                                            <SelectItem value="networking">Peer Networking</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor="motivation">Why do you want to join?</Label>
                            <Textarea 
                                    name="motivation"
                                    id="motivation"
                                    placeholder="Tell us why you're excited to join..."
                                    rows={4}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="studentId">Upload Student ID (Optional)</Label>
                                <Input name="studentId" id="studentId" type="file" />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="consent" required />
                                <Label htmlFor="consent" className="text-sm font-normal">I agree to the community guidelines and terms of service.</Label>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">Join Student Network</Button>
                        </CardFooter>
                    </form>
                </Card>
            </section>

             <section className="py-16">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8 font-headline">What Our Members Say</h2>
                     <Carousel opts={{ loop: true }} className="max-w-2xl mx-auto">
                        <CarouselContent>
                            {[
                                { quote: "I found amazing mentors here!", name: 'Sarah, UK', avatar: 'https://picsum.photos/seed/s1/40/40'},
                                { quote: "The peer support circles are a lifesaver.", name: 'Kenji, Japan', avatar: 'https://picsum.photos/seed/s2/40/40'},
                                { quote: "A great place to connect with students globally.", name: 'Amara, Nigeria', avatar: 'https://picsum.photos/seed/s3/40/40'},
                            ].map((item, index) => (
                                <CarouselItem key={index}>
                                    <Card>
                                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                             <Avatar className="w-16 h-16 mb-4">
                                                <AvatarImage src={item.avatar} alt={item.name} />
                                                <AvatarFallback>{item.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <p className="text-lg italic mb-4">"{item.quote}"</p>
                                            <p className="font-semibold text-primary">{item.name}</p>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="-left-4 md:-left-12" />
                        <CarouselNext className="-right-4 md:-right-12" />
                    </Carousel>
                </div>
            </section>
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

    