
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { assessments } from '@/lib/assessments-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function AssessmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  
  const id = params.id as string;
  const assessment = assessments.find((a) => a.id === id);

  useEffect(() => {
    if (!isUserLoading && !user) {
      toast({
        title: 'Authentication Required',
        description: 'You need to be logged in to start an assessment.',
        variant: 'destructive',
      });
      router.push('/login');
    }
  }, [user, isUserLoading, router, toast]);


  if (!assessment) {
    notFound();
  }
  
  const handleStartAssessment = () => {
    if (!user) {
       toast({
        title: 'Please Log In',
        description: 'You must be logged in to start an assessment.',
        variant: 'destructive'
      });
      router.push('/login');
    } else {
      // Proceed with assessment logic
      toast({
        title: 'Assessment Started!',
        description: `You have started the "${assessment.title}" assessment.`
      });
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading user...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
       <Button variant="ghost" asChild className="mb-4">
        <Link href="/assessments">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assessments
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl md:text-4xl">{assessment.title}</CardTitle>
          <CardDescription className="pt-2 flex items-center gap-4 text-base">
            <span className="flex items-center"><FileText className="mr-2 h-4 w-4"/> {assessment.type}</span>
            <span className="flex items-center"><Clock className="mr-2 h-4 w-4"/> {assessment.estimatedTime} min</span>
            <span className="flex items-center"><Check className="mr-2 h-4 w-4"/> {assessment.difficulty}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-headline">Instructions</h2>
            <p className="text-muted-foreground">
              This is a placeholder for the assessment content. When you're ready, you can start the assessment below.
            </p>
            {/* This is where the actual assessment questions and content would go */}
            <div className="p-8 border rounded-lg bg-muted/50 text-center">
              <p>Assessment content for "{assessment.title}" will be displayed here.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button size="lg" onClick={handleStartAssessment}>Start Assessment</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
