
'use client';

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2, Music, Pause, Play, Volume2, SkipBack, SkipForward, Save } from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { collection, doc, serverTimestamp, where, query, getDocs } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const QUESTIONS = [
  { text: "I often expect the worst outcome in everyday situations.", type: "Catastrophizing" },
  { text: "If something goes wrong, I assume it’s entirely my fault.", type: "Personalization" },
  { text: "If I’m not perfect at something, I think I’ve failed completely.", type: "All-or-nothing thinking" },
  { text: "I pay attention only to negative feedback, ignoring any positives.", type: "Filtering" },
  { text: "I make broad conclusions about myself based on one failure.", type: "Overgeneralization" },
  { text: "I jump to conclusions about how others think or feel about me.", type: "Mind reading" },
  { text: "I use words like ‘always’ or ‘never’ to describe myself or situations.", type: "Overgeneralization / extremes" },
  { text: "Minor setbacks make me feel I’m a hopeless person.", type: "Labeling" },
  { text: "I magnify small problems and downplay successes.", type: "Catastrophizing & discounting positives" },
  { text: "I believe my worth depends on how well I perform.", type: "Conditional self-worth" }
];

const OPTIONAL_PROMPTS = [
    "Which of the above statements felt most true for you?",
    "One small action I can take this week to challenge unhelpful thinking is:"
];

function PastAttempts({ userId }: { userId: string | null }) {
  const firestore = useFirestore();

  const sessionsQuery = useMemoFirebase(() => {
    if (!userId || !firestore) return null;
    return query(
      collection(firestore, 'asm1_reports'),
      where('userId', '==', userId)
    );
  }, [firestore, userId]);

  const { data: reports, isLoading } = useCollection(sessionsQuery);

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading history...</div>
  if (!reports || reports.length === 0) return <div className="text-sm text-muted-foreground">No previous attempts yet.</div>;
  
  return (
    <ul className="text-sm space-y-3">
      {reports.map((s) => (
        <li key={s.id} className="p-2 border rounded-md hover:bg-muted/50">
          <div className="font-semibold">{s.completedAt ? new Date(s.completedAt.toDate()).toLocaleDateString() : 'In Progress'}</div>
          <div className="text-muted-foreground">Score: {s.score} &middot; {s.category}</div>
        </li>
      ))}
    </ul>
  );
}

function ReportView({ report, onRetake }: { report: any; onRetake: () => void }) {
    const chartData = report.history || [];
    const chartConfig = {
      score: {
        label: "Score",
        color: "hsl(var(--primary))",
      },
    };
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">ASM1 Report: Cognitive Distortions</CardTitle>
                    <CardDescription>Your personalized report is ready. Remember, this is a tool for self-reflection, not a diagnosis.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Card className="bg-primary/10 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-primary">Overall Score: {report.score} — {report.category}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg">{report.summary}</p>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6">
                         <Card>
                            <CardHeader><CardTitle>Top Thinking Patterns</CardTitle></CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {report.top_distortions.map((d: string) => <li key={d} className="font-medium">{d}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Suggested Next Steps</CardTitle></CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-2">
                                    {report.suggestions.map((s: string) => <li key={s}>{s}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {chartData.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Progress</CardTitle>
                                <CardDescription>Your scores over the last few attempts.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                                    <BarChart accessibilityLayer data={chartData}>
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 30]}/>
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
                <CardFooter className="gap-4">
                    <Button onClick={onRetake}>Retake Assessment</Button>
                    <Button variant="outline" asChild><Link href="/assessments">Back to Assessments</Link></Button>
                    <Button variant="secondary" disabled>Download PDF (Coming Soon)</Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function Asm1Page() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [optionalAnswers, setOptionalAnswers] = useState<Record<number, string>>({});
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/assessments/asm1');
    } else if (!isUserLoading && user && !sessionId) {
        setLoading(true);
        const sessionData = {
            userId: user.uid,
            status: 'in_progress',
            startedAt: serverTimestamp(),
            version: 'v1'
        };
        addDocumentNonBlocking(collection(firestore, 'asm1_sessions'), sessionData)
            .then(docRef => {
                if (docRef) {
                    setSessionId(docRef.id);
                }
                setLoading(false);
            });
    }
  }, [user, isUserLoading, router, firestore, sessionId]);

  // auto-save on answer change
  useEffect(() => {
    if (!sessionId || !firestore) return;
    const timer = setTimeout(() => {
        const sessionRef = doc(firestore, 'asm1_sessions', sessionId);
        const dataToSave = {
            answers,
            optionalAnswers,
            lastSavedAt: serverTimestamp()
        };
        setDocumentNonBlocking(sessionRef, dataToSave, { merge: true });
        setSavedAt(new Date().toISOString());
    }, 800);
    return () => clearTimeout(timer);
  }, [answers, optionalAnswers, sessionId, firestore]);

   useEffect(() => {
    if (!audioRef.current) return;
    if (musicOn) {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
    } else {
        audioRef.current.pause();
    }
  }, [musicOn]);

  const handleAnswer = (idx: number, value: number) => {
    setAnswers(prev => ({ ...prev, [idx]: value }));
  };

  const handleOptionalAnswer = (idx: number, value: string) => {
    setOptionalAnswers(prev => ({ ...prev, [idx]: value }));
  }

  const handleNext = () => {
    if(current < QUESTIONS.length + OPTIONAL_PROMPTS.length - 1) {
        setCurrent(current + 1);
    }
  };

  const handlePrev = () => {
    if(current > 0) {
        setCurrent(current - 1);
    }
  };
  
  const handleSubmit = async () => {
    if (!firestore || !sessionId || !user) return;
    // Scoring logic
    const totalScore = Object.values(answers).reduce((sum, a) => sum + (a ?? 0), 0);
    
    let category = 'Low';
    let summary = "You show few frequent cognitive distortions. Great self-awareness; keep practicing reflection.";
    let suggestions = ["Keep journaling & notice patterns.", "Try weekly reflection prompts we provide."];
    
    if (totalScore >= 21) {
        category = 'High';
        summary = "Frequent negative thought patterns detected. It may be helpful to explore these further.";
        suggestions = ["We recommend connecting with a professional.", "You can book a consult or join a peer group now."];
    } else if (totalScore >= 14) {
        category = 'Moderate';
        summary = "Noticeable negative thinking patterns. Consider guided exercises or peer support groups.";
        suggestions = ["Join the ‘Anxiety & Mindfulness’ circle.", "Try our 4-week guided exercises.", "Consider a clinician consult if concerns persist."];
    } else if (totalScore >= 7) {
        category = 'Mild';
        summary = "Some unhelpful thinking patterns detected. Small adjustments and self-help practices may help.";
        suggestions = ["Try 2-week cognitive restructuring micro-course.", "Practice labeling thoughts."];
    }

    const distortionCounts: Record<string, number> = {};
    Object.keys(answers).forEach(qIdxStr => {
        const qIdx = Number(qIdxStr);
        if((answers[qIdx] ?? 0) > 1) {
            const type = QUESTIONS[qIdx].type;
            distortionCounts[type] = (distortionCounts[type] || 0) + 1;
        }
    });

    const top_distortions = Object.entries(distortionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(entry => entry[0]);

    const reportData = {
      userId: user.uid,
      sessionId,
      score: totalScore,
      category,
      summary,
      suggestions,
      top_distortions: top_distortions.length ? top_distortions : ["None prominent"],
      completedAt: serverTimestamp(),
    };

    setLoading(true);
    
    await addDocumentNonBlocking(collection(firestore, 'asm1_reports'), reportData);
    const sessionRef = doc(firestore, 'asm1_sessions', sessionId);
    await setDocumentNonBlocking(sessionRef, { status: 'completed', completedAt: serverTimestamp(), total_score: totalScore }, { merge: true });
    
    const sessionsQuery = query(collection(firestore, 'asm1_reports'), where('userId', '==', user.uid));
    const snapshot = await getDocs(sessionsQuery);
    const pastReports = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    
    const history = (pastReports || []).map((r, i) => ({ name: `Attempt ${i+1}`, score: r.score }));

    setReport({...reportData, history: [...history, {name: 'This Time', score: totalScore }]});

    setLoading(false);
  };

  const handleRetake = () => {
      setAnswers({});
      setOptionalAnswers({});
      setCurrent(0);
      setReport(null);
      setSessionId(null); // This will trigger creation of a new session
  }

  if (isUserLoading || loading) return (
      <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" /> <span className="ml-4 text-lg">Loading Assessment...</span>
      </div>
  );

  if (!user) return null;

  if (report) {
    return <ReportView report={report} onRetake={handleRetake} />;
  }
  
  const allRequiredAnswered = Object.keys(answers).length === QUESTIONS.length;
  const isQuestion = current < QUESTIONS.length;
  const currentItem = isQuestion ? QUESTIONS[current] : { text: OPTIONAL_PROMPTS[current - QUESTIONS.length] };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <audio ref={audioRef} src="/media/soft-meditation.mp3" loop />
        <nav className="text-sm text-muted-foreground">
            <Link href="/" className="hover:underline">Home</Link> / <Link href="/assessments" className="hover:underline">Assessments</Link> / Cognitive Distortions (ASM1)
        </nav>
        <Card className="md:col-span-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-2xl">Cognitive Distortions Quiz</CardTitle>
                        <CardDescription>Question {current + 1} of {QUESTIONS.length + OPTIONAL_PROMPTS.length} &middot; Approx. 10 min</CardDescription>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        <span>{savedAt ? `Saved at ${new Date(savedAt).toLocaleTimeString()}` : 'Not saved'}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="my-6">
                    <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${((current + 1) / (QUESTIONS.length + OPTIONAL_PROMPTS.length)) * 100}%` }}></div>
                    </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg min-h-[200px] flex flex-col justify-center">
                    <p className="text-lg font-semibold text-center mb-6">{currentItem.text}</p>
                    {isQuestion ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        {[{v:0, l:'Not at all'}, {v:1, l:'Several days'}, {v:2, l:'More than half the days'}, {v:3, l:'Nearly every day'}].map(({v, l}) => (
                            <Button key={v} onClick={() => handleAnswer(current, v)}
                            variant={answers[current] === v ? 'default' : 'outline'}>
                            {l}
                            </Button>
                        ))}
                        </div>
                    ) : (
                        <textarea
                            className="w-full p-2 border rounded-md"
                            rows={4}
                            placeholder="Your reflection (optional)..."
                            value={optionalAnswers[current - QUESTIONS.length] || ''}
                            onChange={(e) => handleOptionalAnswer(current - QUESTIONS.length, e.target.value)}
                        />
                    )}
                </div>
            </CardContent>
             <CardFooter className="flex justify-between">
                <Button onClick={handlePrev} disabled={current === 0} variant="outline"><SkipBack className="mr-2"/>Previous</Button>
                {current < QUESTIONS.length + OPTIONAL_PROMPTS.length - 1 ? (
                <Button onClick={handleNext}>Next <SkipForward className="ml-2"/></Button>
                ) : (
                <Button onClick={handleSubmit} disabled={!allRequiredAnswered} className="bg-green-600 hover:bg-green-700">Submit & Get Report</Button>
                )}
            </CardFooter>
        </Card>
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                 <CardHeader>
                    <h3 className="font-semibold">Soft music</h3>
                    <p className="text-sm text-muted-foreground">Toggle calming background music to help you focus.</p>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <Button onClick={() => setMusicOn(p => !p)} size="icon" variant="outline">
                        {musicOn ? <Pause /> : <Play />}
                    </Button>
                    <div className="flex items-center gap-2 flex-1">
                        <Volume2 className="text-muted-foreground"/>
                        <input type="range" min={0} max={1} step={0.01} 
                            onChange={(e) => { if(audioRef.current) audioRef.current.volume = parseFloat(e.target.value); }} 
                            defaultValue={0.5} 
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle className="font-headline">Past Attempts</CardTitle></CardHeader>
                <CardContent>
                    <PastAttempts userId={user?.uid} />
                </CardContent>
            </Card>
        </div>
        <Card className="border-destructive/50">
             <CardHeader>
                <CardTitle className="text-destructive">Important Disclaimer</CardTitle>
            </CardHeader>
            <CardContent>
                 <p className="text-sm text-destructive-foreground">This tool is a screening and self-reflection instrument only. It does not replace a clinical assessment. If you are in immediate danger or thinking about harming yourself, contact your local emergency services now.</p>
            </CardContent>
        </Card>
    </div>
  );
}

    