
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
import { ArrowLeft, Loader2, Brain, Globe, Handshake, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { collection, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';


function JoinProfessionalForm() {
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
            description: 'Please log in to join as a professional.',
            variant: 'destructive'
        });
        const redirect = searchParams.get('redirect') || '/community/professional';
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
            professionalTitle: data.professionalTitle,
            organization: data.organization,
            country: data.country,
            yearsOfExperience: data.experience ? Number(data.experience) : null,
            expertise: data.expertise,
            availability: data.availability,
            message: data.message,
            status: 'submitted',
            submittedAt: serverTimestamp(),
        };

        const applicationsRef = collection(firestore, 'professional_applications');
        await addDocumentNonBlocking(applicationsRef, applicationData);

        toast({
            title: 'Application Received!',
            description: `Thank you for your interest. We will review your application and be in touch.`,
        });
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFF] py-12 px-4 text-center">
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
                            <CardTitle className="font-headline text-2xl">Thank you, {user.displayName}!</CardTitle>
                            <CardDescription>Our team will review your credentials and get back to you shortly.</CardDescription>
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
        <div className="bg-white">
            <section className="py-16 bg-muted/50">
                <div className="container mx-auto px-4">
                    <Card className="w-full max-w-2xl mx-auto">
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
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input name="fullName" id="fullName" placeholder="Dr. Jane Doe" defaultValue={user.displayName || ''} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Work Email</Label>
                                        <Input name="email" id="email" type="email" placeholder="Your email" defaultValue={user.email || ''} required />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="professionalTitle">Profession</Label>
                                         <Select name="professionalTitle" required>
                                            <SelectTrigger id="professionalTitle">
                                                <SelectValue placeholder="Select your profession" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="psychologist">Psychologist</SelectItem>
                                                <SelectItem value="therapist">Therapist</SelectItem>
                                                <SelectItem value="psychiatrist">Psychiatrist</SelectItem>
                                                <SelectItem value="researcher">Researcher</SelectItem>
                                                <SelectItem value="educator">Educator</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="organization">Institution / Organization</Label>
                                        <Input name="organization" id="organization" placeholder="Your organization" required />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input name="country" id="country" placeholder="Your country" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="experience">Years of Experience</Label>
                                        <Input name="experience" id="experience" type="number" placeholder="e.g., 5" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="expertise">Area of Expertise</Label>
                                    <Input name="expertise" id="expertise" placeholder="e.g., CBT, Student Mental Health, Educational Tech" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>How do you wish to contribute?</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Mentor', 'Collaborate on Research', 'Be a Speaker', 'Advisory Role'].map(role => (
                                            <div key={role} className="flex items-center space-x-2">
                                                <Checkbox name={`contribution-${role.toLowerCase().replace(/ /g, '-')}`} id={`contribution-${role.toLowerCase()}`} />
                                                <Label htmlFor={`contribution-${role.toLowerCase()}`} className="font-normal">{role}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="certification">Upload Professional ID / License (Optional)</Label>
                                    <Input name="certification" id="certification" type="file" />
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
            </section>
            
            <section className="py-16 bg-white">
                 <div className="container mx-auto text-center px-4">
                     <h2 className="text-2xl md:text-3xl font-bold font-headline mb-4">150+ professionals from 12 countries are collaborating with us.</h2>
                     <div className="flex flex-wrap justify-center gap-4 mt-8">
                        {[
                            { name: 'Dr. Evelyn Reed', title: 'Psychologist', country: 'USA', quote: "Helping students understand their minds." },
                            { name: 'Dr. Kenji Tanaka', title: 'Researcher', country: 'Japan', quote: "Data-driven wellness is the future." },
                            { name: 'Priya Sharma', title: 'Educator', country: 'India', quote: "Empowering the next generation." },
                        ].map(prof => (
                            <Card key={prof.name} className="p-4 w-full max-w-sm text-center hover:shadow-lg transition-shadow">
                               <CardContent className="p-0">
                                <p className="italic text-muted-foreground">"{prof.quote}"</p>
                                <p className="font-semibold mt-2">{prof.name}</p>
                                <p className="text-sm text-primary">{prof.title}, {prof.country}</p>
                               </CardContent>
                            </Card>
                        ))}
                     </div>
                 </div>
            </section>
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

    