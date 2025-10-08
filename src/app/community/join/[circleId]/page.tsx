
'use client';

import { Suspense, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, CheckCircle, Users } from 'lucide-react';
import Link from 'next/link';
import { collection, serverTimestamp } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';

const circlesData: Record<string, { name: string; description: string, color: string }> = {
    "focus-study": { name: "Focus & Study Balance", description: "Share strategies for managing study fatigue.", color: 'bg-blue-100' },
    "anxiety-mindfulness": { name: "Anxiety & Mindfulness", description: "Learn daily habits for emotional balance.", color: 'bg-green-100' },
    "career-confidence": { name: "Career & Confidence", description: "Talk about self-doubt, interviews, and finding purpose.", color: 'bg-purple-100' },
    "open-talks": { name: "Open Talks", description: "A safe space for open sharing with peers.", color: 'bg-yellow-100' }
};

function JoinCircleForm() {
    const params = useParams();
    const router = useRouter();
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const circleId = params.circleId as string;
    const circle = circlesData[circleId];

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
            description: 'Please log in to join a circle.',
            variant: 'destructive'
        });
        router.push(`/login?redirect=/community/join/${circleId}`);
        return null;
    }
    
    if (!circle) {
        return <p>Circle not found.</p>;
    }
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const introMessage = formData.get('intro-message') as string;

        const applicationData = {
            userId: user.uid,
            circleId: circleId,
            introduction: introMessage,
            status: 'submitted',
            submittedAt: serverTimestamp(),
        };
        
        const applicationsRef = collection(firestore, 'circle_applications');
        await addDocumentNonBlocking(applicationsRef, applicationData);

        toast({
            title: 'Application Submitted!',
            description: `Your request to join "${circle.name}" has been sent.`,
        });
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
             <div className="flex flex-col items-center justify-center min-h-screen bg-muted/50 py-12 px-4 text-center">
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
                            <CardTitle className="font-headline text-2xl">Application Sent!</CardTitle>
                            <CardDescription>Your request to join "{circle.name}" is on its way.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Button asChild><Link href={`/community`}>Explore other circles</Link></Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen ${circle.color}`}>
            <div className="container mx-auto py-12 px-4">
                 <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold font-headline">Join your Circle of Growth 🌐</h1>
                    <p className="text-muted-foreground mt-2">You are applying to the "{circle.name}" circle.</p>
                </header>
                <div className="flex justify-center items-center">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <Button variant="ghost" size="sm" className="justify-self-start w-fit" asChild>
                                <Link href="/community"><ArrowLeft className="mr-2 h-4 w-4" />Back to Community</Link>
                            </Button>
                             <div className="flex items-center gap-4 pt-4">
                                <Avatar>
                                    <AvatarImage src={user.photoURL || undefined} />
                                    <AvatarFallback>{user.displayName?.[0] || user.email?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="font-semibold">{user.displayName || 'Anonymous'}</h2>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                <Label htmlFor="intro-message">Why do you want to join this circle?</Label>
                                <Textarea 
                                        name="intro-message"
                                        id="intro-message"
                                        placeholder="Tell the group a little about yourself and why you'd like to join..."
                                        rows={5}
                                        required
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="consent" required />
                                    <Label htmlFor="consent" className="text-sm font-normal">I agree to the circle guidelines and will be respectful to all members.</Label>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit">Join "{circle.name}" Circle</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function JoinCirclePage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <JoinCircleForm />
        </Suspense>
    );
}

    