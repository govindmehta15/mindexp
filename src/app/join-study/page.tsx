
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2, Brain, User, VolunteerActivism, UserCheck, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { collection, serverTimestamp } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function JoinStudyForm() {
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
            description: 'Please log in to join a study.',
            variant: 'destructive'
        });
        const redirect = searchParams.get('redirect') || '/join-study';
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
            areaOfInterest: data.areaOfInterest,
            availability: data.availability,
            reasonToJoin: data.reasonToJoin,
            status: 'submitted',
            submittedAt: serverTimestamp(),
        };
        
        const studyParticipantsRef = collection(firestore, 'study_participants');
        await addDocumentNonBlocking(studyParticipantsRef, applicationData);

        toast({
            title: 'Application Submitted!',
            description: `Your request to join the study program has been sent.`,
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
                            <CardTitle className="font-headline text-2xl">Welcome to the Study Program, {user.displayName}!</CardTitle>
                            <CardDescription>Our research coordinator will contact you soon.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                             <Button asChild><Link href="/">Explore Ongoing Studies</Link></Button>
                             <Button variant="outline" asChild><Link href="/community">Go to Your Dashboard</Link></Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="bg-[#F8FAFF]">
             {/* 1. Hero Section */}
            <section className="py-20 md:py-32 bg-gradient-to-br from-blue-100 to-purple-100">
                <div className="container mx-auto text-center px-4">
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-slate-800">Be Part of Real-World Research.</h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto text-slate-600 mb-8">
                    Your insights help us build better solutions for mental well-being.
                </p>
                <Button size="lg" onClick={() => document.getElementById('join-form')?.scrollIntoView({ behavior: 'smooth' })}>
                    Join Now
                </Button>
                </div>
            </section>

             {/* 2. Eligibility Info Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto text-center px-4">
                    <h2 className="text-2xl md:text-3xl font-bold font-headline mb-4">We welcome students, researchers, professionals, and volunteers!</h2>
                    <div className="grid md:grid-cols-3 gap-8 mt-12">
                        {[
                            { icon: User, title: 'Students', desc: 'Learn and participate in groundbreaking studies.' },
                            { icon: Brain, title: 'Researchers', desc: 'Collaborate on data analysis and co-author papers.' },
                            { icon: VolunteerActivism, title: 'Volunteers', desc: 'Help validate our new tools and provide valuable feedback.' }
                        ].map(card => (
                             <Card key={card.title} className="hover:shadow-lg hover:-translate-y-1 transition-transform">
                                <CardHeader className="items-center">
                                    <div className="bg-blue-100 p-4 rounded-full">
                                        <card.icon className="w-8 h-8 text-primary"/>
                                    </div>
                                    <CardTitle className="font-headline pt-4">{card.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{card.desc}</p>
                                </CardContent>
                             </Card>
                        ))}
                    </div>
                </div>
            </section>

             {/* 3. Form Section */}
            <section id="join-form" className="py-16 md:py-24 bg-white">
                <div className="flex justify-center items-center min-h-screen bg-muted/50 py-12 px-4">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl pt-4">Join Study Program</CardTitle>
                            <CardDescription>Collaborate, Learn, and Contribute to Global Student Research & Mental Wellbeing.</CardDescription>
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
                                        <Label htmlFor="institution">Institution / University</Label>
                                        <Input name="institution" id="institution" placeholder="Your institution" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input name="country" id="country" placeholder="Your country" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="areaOfInterest">Area of Interest</Label>
                                    <Select name="areaOfInterest" required>
                                        <SelectTrigger id="areaOfInterest">
                                            <SelectValue placeholder="Select your area of interest" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cognitive-science">Cognitive Science</SelectItem>
                                            <SelectItem value="behavior-analysis">Behavior Analysis</SelectItem>
                                            <SelectItem value="emotional-health">Emotional Health</SelectItem>
                                            <SelectItem value="tech-psychology">Technology & AI in Psychology</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor="reasonToJoin">How do you want to contribute?</Label>
                                <Textarea 
                                        name="reasonToJoin"
                                        id="reasonToJoin"
                                        placeholder="Tell us why you are interested in joining this study program..."
                                        rows={5}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="resume">Upload Resume / Profile (Optional)</Label>
                                    <Input name="resume" id="resume" type="file" />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="consent" required />
                                    <Label htmlFor="consent" className="text-sm font-normal">I agree to participate in ethical research and data policies.</Label>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="rounded-xl">Join Study Program</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </section>
            
            {/* 4. Community Preview Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto text-center px-4">
                     <h2 className="text-2xl md:text-3xl font-bold font-headline mb-4">240+ participants from 15+ universities have joined!</h2>
                     <div className="flex flex-wrap justify-center gap-4 mt-8">
                        {[
                            { name: 'Alex', uni: 'State University', tag: 'Research Volunteer', avatar: 'https://picsum.photos/seed/p1/40/40'},
                            { name: 'Maria', uni: 'Tech Institute', tag: 'AI & Psychology', avatar: 'https://picsum.photos/seed/p2/40/40'},
                            { name: 'Chen', uni: 'Global University', tag: 'Research Volunteer', avatar: 'https://picsum.photos/seed/p3/40/40'},
                             { name: 'Fatima', uni: 'Open University', tag: 'Emotional Health', avatar: 'https://picsum.photos/seed/p4/40/40'},
                        ].map(p => (
                            <Card key={p.name} className="p-4 flex items-center gap-3 w-fit">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={p.avatar} />
                                    <AvatarFallback>{p.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{p.name}</p>
                                    <p className="text-sm text-muted-foreground">{p.uni}</p>
                                </div>
                            </Card>
                        ))}
                     </div>
                </div>
            </section>
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

    