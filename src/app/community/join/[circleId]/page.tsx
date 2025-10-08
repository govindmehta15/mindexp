
'use client';

import { Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { collection, serverTimestamp } from 'firebase/firestore';

const circlesData: Record<string, { name: string; description: string }> = {
    "focus-study": { name: "Focus & Study Balance", description: "Share strategies for managing study fatigue." },
    "anxiety-mindfulness": { name: "Anxiety & Mindfulness", description: "Learn daily habits for emotional balance." },
    "career-confidence": { name: "Career & Confidence", description: "Talk about self-doubt, interviews, and finding purpose." },
    "open-talks": { name: "Open Talks", description: "A safe space for open sharing with peers." }
};

function JoinCircleForm() {
    const params = useParams();
    const router = useRouter();
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const circleId = params.circleId as string;
    const circle = circlesData[circleId];

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
        router.push('/community');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-muted/50 py-12">
            <Card className="w-full max-w-2xl">
                 <CardHeader>
                    <Button variant="ghost" size="sm" className="justify-self-start w-fit" asChild>
                        <Link href="/community"><ArrowLeft className="mr-2 h-4 w-4" />Back to Community</Link>
                    </Button>
                    <CardTitle className="font-headline text-2xl pt-4">Join "{circle.name}"</CardTitle>
                    <CardDescription>{circle.description}</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                           <Label htmlFor="intro-message">Your Introduction</Label>
                           <Textarea 
                                name="intro-message"
                                id="intro-message"
                                placeholder="Tell the group a little about yourself and why you'd like to join..."
                                rows={5}
                            />
                            <p className="text-xs text-muted-foreground">
                                Your profile name ({user.displayName || 'Anonymous'}) will be shared with the circle moderator.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Submit Application</Button>
                    </CardFooter>
                </form>
            </Card>
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
