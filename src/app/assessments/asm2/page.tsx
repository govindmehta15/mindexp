
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Loader2, ArrowLeft, ArrowRight, PlayCircle, BookOpen, FileText, Lightbulb, Music, Volume2, Pause, Play, Download, Calendar, Sparkles, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { collection, doc, serverTimestamp, where, query, getDocs } from 'firebase/firestore';
import Image from 'next/image';

// --- DATA MOCKS (as per spec) ---

const LEARNING_MODULES = [
    { id: 'm1', title: 'Active Recall & Testing', type: 'video', duration: 3, content: 'A 3-minute video explaining the testing effect.', url: '#', imageUrl: 'https://picsum.photos/seed/lm1/300/150', imageHint: 'person studying' },
    { id: 'm2', title: 'Spacing & Interleaving', type: 'infographic', duration: 4, content: 'An infographic and short video on spacing your studies.', url: '#', imageUrl: 'https://picsum.photos/seed/lm2/300/150', imageHint: 'calendar schedule' },
    { id: 'm3', title: 'Study Routines & Timeboxing', type: 'video', duration: 3, content: 'A template and video on the Pomodoro technique.', url: '#', imageUrl: 'https://picsum.photos/seed/lm3/300/150', imageHint: 'timer clock' },
    { id: 'm4', title: 'Evidence Primer', type: 'reading', duration: 5, content: 'A one-page PDF summarizing the core research.', url: '#', imageUrl: 'https://picsum.photos/seed/lm4/300/150', imageHint: 'research paper' },
];


const ASSESSMENT_ITEMS = [
    { id: 'q1', type: 'mcq', question: "Which technique best helps with long-term retention of factual material?", options: ["Re-read notes repeatedly", "Highlight key sentences", "Test yourself and space practice over days", "Study for long hours once"], answer: 2, topic: 'Retrieval' },
    { id: 'q2', type: 'mcq', question: "What is 'interleaving'?", options: ["Mixing different topics in one study session", "Focusing on one topic for a long time", "Studying with a friend", "Using flashcards"], answer: 0, topic: 'Interleaving' },
    { id: 'scenario', type: 'scenario', question: "You have two chapters to study for a test in one week. You prefer to study for long continuous sessions. What combination would you use?", options: ["Interleaving", "Spaced Repetition", "Summarization", "Re-reading"] },
    { id: 'reflection', type: 'reflection', question: "Describe one concrete change you will make to your study routine this week." },
    { id: 'plan', type: 'plan', question: "Build a 30-minute study plan using the Pomodoro technique." },
];

// --- REPORTING LOGIC ---

function generateReport(answers: Record<string, any>) {
    // Dummy scoring for demonstration
    let score = 0;
    if (answers['q1'] === 2) score += 25;
    if (answers['q2'] === 0) score += 25;
    if (answers['scenario']?.includes("Spaced Repetition")) score += 25;
    if (answers['plan']?.length > 0) score += 25;
    
    let category = "Needs Support";
    if (score >= 85) category = "Expert";
    else if (score >= 70) category = "Competent";
    else if (score >= 50) category = "Developing";

    return {
        score,
        category,
        topicBreakdown: [
            { name: 'Retrieval', score: answers['q1'] === 2 ? 100 : 20 },
            { name: 'Spacing', score: answers['scenario']?.includes("Spaced Repetition") ? 100 : 30 },
            { name: 'Interleaving', score: answers['q2'] === 0 ? 100 : 10 },
            { name: 'Time Mgmt', score: answers['plan']?.length > 0 ? 90 : 40 },
        ],
        suggestions: [
            score < 70 && "Start with 10-minute self-quizzes after each session.",
            !answers['scenario']?.includes("Spaced Repetition") && "Try the 1-3-7 day rule for reviewing new topics.",
            "Use the Pomodoro technique for your next 3 study sessions.",
        ].filter(Boolean),
    };
}


// --- UI COMPONENTS ---

function LearningModule({ module, isCompleted, onComplete }: any) {
    const Icon = module.type === 'video' ? PlayCircle : module.type === 'reading' ? BookOpen : ImageIcon;
    return (
        <Card className={`mb-4 transition-all ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
            <CardContent className="p-4 grid md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2 flex items-start gap-4">
                    <div className='flex-shrink-0'>
                        <Checkbox checked={isCompleted} onCheckedChange={() => onComplete(module.id)} className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold">{module.title}</h3>
                        <p className="text-sm text-muted-foreground">{module.content}</p>
                        <div className="flex items-center gap-4 mt-2">
                             <Badge variant="secondary" className="flex items-center gap-1">
                                <Icon className="w-3 h-3" />
                                {module.type}
                            </Badge>
                            <Button variant="link" size="sm" asChild className="p-0 h-auto">
                                <Link href={module.url} target="_blank">View Content</Link>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="relative h-24 w-full md:w-auto rounded-md overflow-hidden">
                    <Image src={module.imageUrl} alt={module.title} layout="fill" objectFit="cover" data-ai-hint={module.imageHint} />
                     {module.type === 'video' && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><PlayCircle className="w-8 h-8 text-white/80" /></div>}
                </div>
            </CardContent>
        </Card>
    );
}


function ReportView({ report, onRetake }: { report: any; onRetake: () => void }) {
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
                    <CardTitle className="font-headline text-3xl text-navy-blue">ASM-2 Report: Effective Study Techniques</CardTitle>
                    <CardDescription>Your personalized report and action plan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <Card className="bg-mint-green/10 border-mint-green/30 text-center p-6">
                        <CardTitle className="text-navy-blue">Overall Score: {report.score}/100</CardTitle>
                        <p className="text-2xl font-bold text-mint-green-dark mt-1">{report.category}</p>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6">
                         <Card>
                            <CardHeader><CardTitle>Topic Breakdown</CardTitle></CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                                    <BarChart accessibilityLayer data={report.topicBreakdown}>
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]}/>
                                        <Tooltip cursor={{fill: 'hsla(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                                        <Bar dataKey="score" fill="var(--color-score, hsl(var(--primary)))" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="text-mint-green"/> Personalized Suggestions</CardTitle></CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-3">
                                    {report.suggestions.map((s: string) => <li key={s}>{s}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                     <Card>
                        <CardHeader><CardTitle>Your 7-Day Starter Plan</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            <p>Here’s a sample plan to get you started:</p>
                            <ul className="text-sm list-decimal list-inside text-muted-foreground">
                                <li>**Day 1:** Review today's lecture notes using active recall (15 mins).</li>
                                <li>**Day 2:** Quick self-quiz on Day 1 content (10 mins).</li>
                                <li>**Day 3:** Mix practice problems from two different topics (25 mins).</li>
                            </ul>
                        </CardContent>
                        <CardFooter className="gap-2">
                             <Button><Calendar className="mr-2"/> Add to Calendar</Button>
                             <Button variant="outline"><Download className="mr-2"/> Download Plan</Button>
                        </CardFooter>
                    </Card>
                </CardContent>
                <CardFooter className="gap-4">
                    <Button onClick={onRetake}>Retake Assessment</Button>
                    <Button variant="outline" asChild><Link href="/assessments">Back to Assessments</Link></Button>
                </CardFooter>
            </Card>
        </div>
    );
}


// --- MAIN PAGE COMPONENT ---

export default function Asm2Page() {
    const router = useRouter();
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const [sessionId, setSessionId] = useState<string | null>(null);
    const [step, setStep] = useState('learning'); // learning, assessment, report
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [completedModules, setCompletedModules] = useState<string[]>([]);
    const [report, setReport] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [musicOn, setMusicOn] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!isUserLoading) {
            if (!user) {
                router.push('/login?redirect=/assessments/asm2');
            } else if (user && !sessionId) {
                setIsLoading(true);
                const sessionData = {
                    userId: user.uid,
                    status: 'learning',
                    startedAt: serverTimestamp(),
                    version: 'v1',
                    answers: {},
                    completedModules: []
                };
                addDocumentNonBlocking(collection(firestore, 'asm2_sessions'), sessionData)
                    .then(docRef => {
                        if (docRef) {
                            setSessionId(docRef.id);
                        }
                        setIsLoading(false);
                    });
            } else {
                 setIsLoading(false);
            }
        }
    }, [user, isUserLoading, router, firestore, sessionId]);
    
    // Auto-save logic
    useEffect(() => {
        if (!sessionId || !firestore || isLoading) return;
        const timer = setTimeout(() => {
            const sessionRef = doc(firestore, 'asm2_sessions', sessionId);
            const dataToSave = {
                answers,
                completedModules,
                lastSavedAt: serverTimestamp(),
                status: step,
            };
            setDocumentNonBlocking(sessionRef, dataToSave, { merge: true });
        }, 1000);
        return () => clearTimeout(timer);
    }, [answers, completedModules, step, sessionId, firestore, isLoading]);


    const handleCompleteModule = (moduleId: string) => {
        setCompletedModules(prev => {
            const newModules = prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...new Set([...prev, moduleId])];

            if (sessionId) {
                const sessionRef = doc(firestore, 'asm2_sessions', sessionId);
                setDocumentNonBlocking(sessionRef, { completedModules: newModules }, { merge: true });
            }
            return newModules;
        });
    };

    const startAssessment = () => {
        if (completedModules.length === LEARNING_MODULES.length) {
            setStep('assessment');
        } else {
            // In a real app, you might show a toast or alert
            alert("Please complete all learning modules before starting the assessment.");
        }
    };
    
    const handleAnswer = (questionId: string, value: any) => {
        setAnswers(prev => ({...prev, [questionId]: value}));
    };
    
    const nextQuestion = () => setCurrentQuestion(prev => prev + 1);
    const prevQuestion = () => setCurrentQuestion(prev => prev - 1);
    
    const handleSubmit = async () => {
        if (!firestore || !sessionId || !user) return;

        const finalReportData = generateReport(answers);
        
        const reportToStore = {
            userId: user.uid,
            sessionId,
            score: finalReportData.score,
            category: finalReportData.category,
            topicBreakdown: finalReportData.topicBreakdown,
            suggestions: finalReportData.suggestions,
            completedAt: serverTimestamp(),
        };

        setIsLoading(true);
        
        await addDocumentNonBlocking(collection(firestore, 'asm2_reports'), reportToStore);
        const sessionRef = doc(firestore, 'asm2_sessions', sessionId);
        await setDocumentNonBlocking(sessionRef, { status: 'report', completedAt: serverTimestamp(), total_score: finalReportData.score }, { merge: true });

        setReport(finalReportData);
        setStep('report');
        setIsLoading(false);
    };

    const handleRetake = () => {
        setAnswers({});
        setCompletedModules([]);
        setCurrentQuestion(0);
        setReport(null);
        setStep('learning');
        setSessionId(null); // This will trigger creation of a new session
    };


    if (isLoading || isUserLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /> <span className="ml-4 text-lg">Loading...</span></div>;
    }
    
    if (step === 'report' && report) {
        return <ReportView report={report} onRetake={handleRetake} />
    }

    const currentItem = ASSESSMENT_ITEMS[currentQuestion];
    
    return (
        <div className="bg-gray-50 min-h-screen">
             <audio ref={audioRef} src="/media/soft-meditation.mp3" loop />
            <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b z-10">
                <div className="container mx-auto flex items-center justify-between p-4">
                     <div>
                        <h1 className="font-headline text-xl font-bold text-navy-blue">Effective Study Techniques</h1>
                        <p className="text-sm text-muted-foreground">Approx. 25 minutes</p>
                    </div>
                    <Button variant="outline" size="sm" asChild><Link href="/assessments"><ArrowLeft className="mr-2" /> Quit</Link></Button>
                </div>
            </header>
            
            <div className="container mx-auto grid lg:grid-cols-3 gap-8 p-4 md:p-6">
                {/* Main Content */}
                <main className="lg:col-span-2">
                    {step === 'learning' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Learning Modules</CardTitle>
                                <CardDescription>Complete these short lessons to unlock the assessment.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {LEARNING_MODULES.map(m => (
                                    <LearningModule key={m.id} module={m} isCompleted={completedModules.includes(m.id)} onComplete={handleCompleteModule} />
                                ))}
                            </CardContent>
                            <CardFooter>
                                <Button onClick={startAssessment} disabled={completedModules.length < LEARNING_MODULES.length}>
                                    Start Assessment <ArrowRight className="ml-2"/>
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {step === 'assessment' && currentItem && (
                        <Card>
                            <CardHeader>
                                 <Progress value={(currentQuestion / ASSESSMENT_ITEMS.length) * 100} className="mb-2"/>
                                <CardDescription>Question {currentQuestion + 1} of {ASSESSMENT_ITEMS.length}</CardDescription>
                                <CardTitle className="text-lg md:text-xl">{currentItem.question}</CardTitle>
                            </CardHeader>
                            <CardContent className="min-h-[200px]">
                                {currentItem.type === 'mcq' && (
                                    <div className="space-y-2">
                                        {currentItem.options?.map((opt, idx) => (
                                            <Button key={idx} variant={answers[currentItem.id] === idx ? 'default' : 'outline'} className="w-full justify-start text-left h-auto py-3" onClick={() => handleAnswer(currentItem.id, idx)}>{opt}</Button>
                                        ))}
                                    </div>
                                )}
                                {currentItem.type === 'scenario' && (
                                     <div className="space-y-2">
                                        {currentItem.options?.map((opt, idx) => (
                                            <label key={idx} className="flex items-center gap-3 p-3 border rounded-md hover:bg-muted has-[:checked]:bg-blue-50 has-[:checked]:border-blue-300">
                                                <Checkbox
                                                    checked={answers[currentItem.id]?.includes(opt)}
                                                    onCheckedChange={(checked) => {
                                                        const currentAns = answers[currentItem.id] || [];
                                                        if (checked) {
                                                            handleAnswer(currentItem.id, [...currentAns, opt]);
                                                        } else {
                                                            handleAnswer(currentItem.id, currentAns.filter((a: string) => a !== opt));
                                                        }
                                                    }}
                                                />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                                {currentItem.type === 'reflection' && (
                                    <textarea className="w-full p-2 border rounded-md" rows={5} placeholder="Your reflection..." onChange={e => handleAnswer(currentItem.id, e.target.value)} value={answers[currentItem.id] || ''}></textarea>
                                )}
                                {currentItem.type === 'plan' && (
                                    <div className="p-4 border-dashed border-2 rounded-lg text-center">
                                        <p className="text-muted-foreground mb-4">Drag & drop study blocks here (Interactive UI Placeholder)</p>
                                        <Button onClick={() => handleAnswer(currentItem.id, ['Pomodoro', 'Break'])}>Simulate Plan Creation</Button>
                                         {answers[currentItem.id] && <p className="text-green-600 mt-2">Plan created!</p>}
                                    </div>
                                )}
                            </CardContent>
                             <CardFooter className="justify-between">
                                <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0}>Previous</Button>
                                {currentQuestion < ASSESSMENT_ITEMS.length - 1 ? (
                                    <Button onClick={nextQuestion}>Next</Button>
                                ) : (
                                    <Button onClick={handleSubmit} className="bg-mint-green hover:bg-mint-green-dark text-white">Finish & See Report</Button>
                                )}
                            </CardFooter>
                        </Card>
                    )}
                </main>

                {/* Right Panel */}
                <aside className="space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-base">Quick Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                           <p className="flex items-start gap-2"><Lightbulb className="text-yellow-400 mt-1 flex-shrink-0"/><span>Active recall is more effective than passive re-reading.</span></p>
                           <p className="flex items-start gap-2"><Lightbulb className="text-yellow-400 mt-1 flex-shrink-0"/><span>Mixing topics (interleaving) helps your brain make connections.</span></p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-base">Focus Music</CardTitle>
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
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}

// Custom styles for this page
const customStyles = `
.bg-navy-blue { background-color: #1e40af; }
.text-navy-blue { color: #1e40af; }
.bg-mint-green { background-color: #10b981; }
.text-mint-green { color: #10b981; }
.bg-mint-green-dark { background-color: #059669; }
.border-mint-green { border-color: #10b981; }
`;

if (typeof window !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);
}

    