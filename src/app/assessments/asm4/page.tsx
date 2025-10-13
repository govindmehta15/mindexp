'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { useAssessmentStatusContext } from '@/contexts/AssessmentStatusContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Loader2, 
  Users, 
  Mic, 
  MessageCircle, 
  HelpCircle, 
  Smartphone,
  Heart,
  Brain,
  TrendingUp,
  Calendar,
  Download,
  Eye,
  EyeOff,
  Play,
  Pause,
  Volume2,
  VolumeX,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Target,
  Award,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { collection, doc, serverTimestamp, where, query, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Scenario data structure
interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  questions: Question[];
  feedback: string;
}

interface Question {
  id: string;
  type: 'likert' | 'multiple' | 'text' | 'checkbox' | 'reflection';
  text: string;
  options?: string[];
  scale?: { min: number; max: number; labels: string[] };
}

// Assessment scenarios
const SCENARIOS: Scenario[] = [
  {
    id: 'meeting_people',
    title: 'Meeting New People',
    description: 'You enter a party where you know no one. Someone walks toward you and smiles.',
    icon: Users,
    questions: [
      {
        id: 'anxiety_level',
        type: 'likert',
        text: 'How anxious would you feel at that moment?',
        scale: { min: 1, max: 5, labels: ['Calm', 'Slightly anxious', 'Moderately anxious', 'Very anxious', 'Extremely anxious'] }
      },
      {
        id: 'greeting_behavior',
        type: 'multiple',
        text: 'Would you greet them first or wait for them to speak?',
        options: ['I would greet first', 'I\'d smile but wait', 'I\'d avoid contact']
      },
      {
        id: 'first_thought',
        type: 'multiple',
        text: 'What thought comes first?',
        options: ['They seem nice', 'I might say something weird', 'I don\'t want to be here']
      }
    ],
    feedback: 'High anxiety + avoidance → "You may fear negative evaluation; practice small introductions."'
  },
  {
    id: 'public_speaking',
    title: 'Public Speaking',
    description: 'You are asked to present a short project in front of classmates or teammates.',
    icon: Mic,
    questions: [
      {
        id: 'confidence_level',
        type: 'likert',
        text: 'How confident are you before starting?',
        scale: { min: 1, max: 5, labels: ['Very confident', 'Confident', 'Neutral', 'Nervous', 'Very nervous'] }
      },
      {
        id: 'physical_sensations',
        type: 'checkbox',
        text: 'Physical sensations noticed:',
        options: ['Sweating', 'Fast heartbeat', 'Shaking', 'Dry mouth', 'None of these']
      },
      {
        id: 'audience_reaction',
        type: 'multiple',
        text: 'How do you think the audience will react?',
        options: ['Supportive', 'Neutral', 'Critical']
      }
    ],
    feedback: 'If user rates <3, suggest "mirror speaking exercise" or "recorded speech practice."'
  },
  {
    id: 'group_discussion',
    title: 'Group Discussion',
    description: 'You join a group already talking. You have a different opinion.',
    icon: MessageCircle,
    questions: [
      {
        id: 'share_opinion',
        type: 'multiple',
        text: 'Would you share your opinion?',
        options: ['Yes, confidently', 'Only if asked', 'No, I\'d stay quiet']
      },
      {
        id: 'judgment_fear',
        type: 'likert',
        text: 'What\'s your fear level about being judged?',
        scale: { min: 1, max: 5, labels: ['No fear', 'Slight fear', 'Moderate fear', 'High fear', 'Extreme fear'] }
      },
      {
        id: 'disagreement_reaction',
        type: 'multiple',
        text: 'If someone disagrees, how would you react?',
        options: ['Defend calmly', 'Withdraw', 'Feel embarrassed']
      },
      {
        id: 'opinion_text',
        type: 'text',
        text: 'Choose a sample discussion topic: "Is online education better than offline?" Type 2-3 sentences to express your opinion.'
      }
    ],
    feedback: 'Practice expressing opinions in low-stakes environments first.'
  },
  {
    id: 'asking_help',
    title: 'Asking for Help',
    description: 'You didn\'t understand a topic at work or in class. You need to ask your senior or professor for clarification.',
    icon: HelpCircle,
    questions: [
      {
        id: 'nervous_approach',
        type: 'likert',
        text: 'Do you feel nervous approaching them?',
        scale: { min: 1, max: 5, labels: ['Not nervous', 'Slightly nervous', 'Moderately nervous', 'Very nervous', 'Extremely nervous'] }
      },
      {
        id: 'what_stops_you',
        type: 'multiple',
        text: 'What stops you?',
        options: ['Fear of looking incompetent', 'They seem busy', 'I prefer to manage alone']
      },
      {
        id: 'worst_case',
        type: 'text',
        text: 'What\'s the worst thing that could happen if you ask?'
      }
    ],
    feedback: 'Encourage "help-seeking as a strength," referencing social support research.'
  },
  {
    id: 'online_interaction',
    title: 'Online Interaction',
    description: 'You post something on social media. It gets few likes and no comments.',
    icon: Smartphone,
    questions: [
      {
        id: 'emotional_response',
        type: 'multiple',
        text: 'How do you feel?',
        options: ['Unaffected', 'A bit disappointed', 'Very upset']
      },
      {
        id: 'delete_post',
        type: 'multiple',
        text: 'Do you delete or hide the post?',
        options: ['No', 'Maybe', 'Yes, immediately']
      },
      {
        id: 'social_comparison',
        type: 'multiple',
        text: 'Do you compare yourself to others online?',
        options: ['Rarely', 'Sometimes', 'Often']
      }
    ],
    feedback: 'Introduce "digital self-esteem awareness" — normalize online response neutrality.'
  }
];

// Warm-up questions
const WARMUP_QUESTIONS = [
  {
    id: 'social_nervousness',
    text: 'How often do you feel nervous in social settings (like talking to strangers, giving opinions, or being in a group)?',
    options: ['Rarely', 'Occasionally', 'Often', 'Almost always'],
    scores: [1, 2, 3, 4]
  }
];

// Mindfulness audio component
function MindfulnessAudio({ isPlaying, onToggle }: { isPlaying: boolean; onToggle: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
      <audio ref={audioRef} src="/media/asm4/mindfulness.mp3" loop />
      <Button
        size="sm"
        variant="outline"
        onClick={onToggle}
        className="flex items-center space-x-2"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        <span>{isPlaying ? 'Pause' : 'Play'} Mindfulness</span>
      </Button>
      <div className="text-sm text-muted-foreground">
        "Take a deep breath in... hold... and exhale slowly. You're doing well."
      </div>
    </div>
  );
}

// Warm-up section component
function WarmupSection({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [reflection, setReflection] = useState('');

  const handleSubmit = () => {
    onSubmit({ answers, reflection });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center">Welcome to Social Anxiety Assessment</CardTitle>
          <CardDescription className="text-center text-lg">
            You're not alone — everyone feels anxious sometimes. This exercise helps you identify your social comfort zones and growth areas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Heart className="w-10 h-10 text-blue-600" />
            </motion.div>
            <p className="text-muted-foreground">Take your time and be honest with yourself</p>
          </div>

          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold mb-4 block">
                {WARMUP_QUESTIONS[0].text}
              </Label>
              <RadioGroup
                value={answers[WARMUP_QUESTIONS[0].id]}
                onValueChange={(value) => setAnswers(prev => ({ ...prev, [WARMUP_QUESTIONS[0].id]: value }))}
                className="space-y-3"
              >
                {WARMUP_QUESTIONS[0].options.map((option, index) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="text-base">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-lg font-semibold mb-4 block">
                Reflection Task: Close your eyes for 30 seconds. Recall your last social event. How did you feel before and after it?
              </Label>
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Write a short note (30-60 words) about your feelings..."
                rows={4}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-2">
                {reflection.length}/60 words
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full" size="lg">
            Continue to Scenarios
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Scenario component
function ScenarioComponent({ 
  scenario, 
  currentQuestion, 
  answers, 
  onAnswer, 
  onNext, 
  onPrev, 
  isLast 
}: {
  scenario: Scenario;
  currentQuestion: number;
  answers: Record<string, any>;
  onAnswer: (questionId: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isLast: boolean;
}) {
  const question = scenario.questions[currentQuestion];
  const Icon = scenario.icon;

  const renderQuestion = () => {
    switch (question.type) {
      case 'likert':
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{question.scale?.labels[0]}</span>
              <span>{question.scale?.labels[question.scale.labels.length - 1]}</span>
            </div>
            <Slider
              value={[answers[question.id] || 1]}
              onValueChange={(value) => onAnswer(question.id, value[0])}
              min={question.scale?.min || 1}
              max={question.scale?.max || 5}
              step={1}
              className="w-full"
            />
            <div className="text-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {answers[question.id] || 1} - {question.scale?.labels[(answers[question.id] || 1) - 1]}
              </Badge>
            </div>
          </div>
        );

      case 'multiple':
        return (
          <RadioGroup
            value={answers[question.id]}
            onValueChange={(value) => onAnswer(question.id, value)}
            className="space-y-3"
          >
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="text-base cursor-pointer flex-1">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <Checkbox
                  id={option}
                  checked={answers[question.id]?.includes(option) || false}
                  onCheckedChange={(checked) => {
                    const current = answers[question.id] || [];
                    if (checked) {
                      onAnswer(question.id, [...current, option]);
                    } else {
                      onAnswer(question.id, current.filter((item: string) => item !== option));
                    }
                  }}
                />
                <Label htmlFor={option} className="text-base cursor-pointer flex-1">{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'text':
        return (
          <Textarea
            value={answers[question.id] || ''}
            onChange={(e) => onAnswer(question.id, e.target.value)}
            placeholder="Type your response here..."
            rows={4}
            className="w-full"
          />
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      key={`${scenario.id}-${currentQuestion}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Icon className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <CardTitle className="font-headline text-2xl">{scenario.title}</CardTitle>
              <CardDescription className="text-base">{scenario.description}</CardDescription>
            </div>
          </div>
          <Progress 
            value={((currentQuestion + 1) / scenario.questions.length) * 100} 
            className="h-2"
          />
          <p className="text-sm text-muted-foreground text-center">
            Question {currentQuestion + 1} of {scenario.questions.length}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-lg font-semibold mb-4 block">
              {question.text}
            </Label>
            {renderQuestion()}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onPrev} 
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button 
            onClick={onNext}
            disabled={!answers[question.id]}
          >
            {isLast ? 'Complete Assessment' : 'Next Question'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Scoring logic
function calculateSocialAnxietyIndex(answers: Record<string, any>): {
  fne: number; // Fear of Negative Evaluation
  sa: number;  // Social Avoidance
  sc: number;  // Self Confidence
  cs: number;  // Coping Strategy
  sai: number; // Social Anxiety Index
} {
  // Fear of Negative Evaluation (FNE)
  const fne = (answers.anxiety_level || 1) + (answers.judgment_fear || 1) + (answers.nervous_approach || 1);
  
  // Social Avoidance (SA)
  const avoidanceAnswers = [
    answers.greeting_behavior,
    answers.share_opinion,
    answers.what_stops_you,
    answers.delete_post
  ];
  const sa = avoidanceAnswers.filter(answer => 
    answer?.includes('avoid') || 
    answer?.includes('stay quiet') || 
    answer?.includes('Yes, immediately') ||
    answer?.includes('manage alone')
  ).length * 2.5;

  // Self Confidence (SC) - reverse scored
  const confidenceAnswers = [
    answers.confidence_level,
    answers.share_opinion,
    answers.greeting_behavior
  ];
  const sc = confidenceAnswers.reduce((sum, answer) => {
    if (typeof answer === 'number') return sum + (6 - answer); // reverse score
    if (answer?.includes('confidently') || answer?.includes('greet first')) return sum + 4;
    return sum + 2;
  }, 0);

  // Coping Strategy (CS)
  const cs = answers.reflection?.length > 30 ? 3 : 1; // Basic text analysis

  // Social Anxiety Index
  const sai = Math.max(0, Math.min(10, ((fne + sa) - sc + (5 - cs)) / 4));

  return { fne: fne / 3, sa, sc: sc / 3, cs, sai };
}

// Report component
function ReportView({ 
  report, 
  onRetake 
}: { 
  report: any; 
  onRetake: () => void; 
}) {
  const getAnxietyLevel = (sai: number) => {
    if (sai <= 3) return { level: 'Low', color: 'text-green-600', description: 'Comfortable, healthy confidence' };
    if (sai <= 6) return { level: 'Moderate', color: 'text-yellow-600', description: 'Occasional anxiety; needs practice' };
    return { level: 'High', color: 'text-red-600', description: 'Persistent fear, may need guidance' };
  };

  const anxietyLevel = getAnxietyLevel(report.sai);

  const getRecommendations = (sai: number, fne: number, sa: number, sc: number) => {
    const recommendations = [];
    
    if (sai <= 3) {
      recommendations.push('Great job! You have healthy social confidence.');
      recommendations.push('Continue practicing social interactions to maintain your skills.');
    } else if (sai <= 6) {
      recommendations.push('Practice short daily exposure (say hello to one new person).');
      recommendations.push('Try 5-minute social visualization before real events.');
      recommendations.push('Join smaller social circles to build comfort gradually.');
    } else {
      recommendations.push('Consider professional guidance for social anxiety management.');
      recommendations.push('Start with very small social interactions and build up gradually.');
      recommendations.push('Practice mindfulness and breathing exercises before social events.');
    }

    if (fne > 4) {
      recommendations.push('Work on reducing fear of judgment through cognitive reframing.');
    }
    if (sa > 4) {
      recommendations.push('Practice gradual exposure to social situations you typically avoid.');
    }
    if (sc < 3) {
      recommendations.push('Build confidence through small wins in low-stakes social situations.');
    }

    return recommendations;
  };

  const recommendations = getRecommendations(report.sai, report.fne, report.sa, report.sc);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center">Your Social Anxiety Assessment Report</CardTitle>
          <CardDescription className="text-center">
            Based on your responses to various social scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Overall Score */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className={`text-center text-2xl ${anxietyLevel.color}`}>
                Social Anxiety Level: {anxietyLevel.level}
              </CardTitle>
              <CardDescription className="text-center text-lg">
                {anxietyLevel.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {report.sai.toFixed(1)}/10
                </div>
                <Progress value={(report.sai / 10) * 100} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Detailed Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span>Fear of Negative Evaluation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {report.fne.toFixed(1)}/5
                </div>
                <p className="text-sm text-muted-foreground">
                  Sensitivity to social judgment and evaluation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <EyeOff className="w-5 h-5 text-orange-600" />
                  <span>Social Avoidance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  {report.sa.toFixed(1)}/10
                </div>
                <p className="text-sm text-muted-foreground">
                  Tendency to avoid social situations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span>Self Confidence</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {report.sc.toFixed(1)}/5
                </div>
                <p className="text-sm text-muted-foreground">
                  Comfort in expressing yourself socially
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-purple-600" />
                  <span>Coping Strategy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {report.cs.toFixed(1)}/5
                </div>
                <p className="text-sm text-muted-foreground">
                  Ability to manage social stress
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>Personalized Growth Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reflection */}
          {report.reflection && (
            <Card>
              <CardHeader>
                <CardTitle>Your Reflection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="italic text-muted-foreground">"{report.reflection}"</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={onRetake} variant="outline">
            Take Assessment Again
          </Button>
          <Button asChild>
            <Link href="/assessments">Back to Assessments</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Main ASM4 page component
export default function Asm4Page() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { refreshStatuses } = useAssessmentStatusContext();

  const [step, setStep] = useState<'warmup' | 'scenarios' | 'report'>('warmup');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [warmupData, setWarmupData] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mindfulnessPlaying, setMindfulnessPlaying] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/assessments/asm4');
    }
  }, [user, isUserLoading, router]);

  const handleWarmupSubmit = async (data: any) => {
    if (!firestore || !user) return;
    
    setIsLoading(true);
    setWarmupData(data);
    
    const sessionData = {
      userId: user.uid,
      assessment: 'ASM-4',
      status: 'in_progress',
      startedAt: serverTimestamp(),
      warmupData: data
    };

    try {
      const docRef = await addDocumentNonBlocking(collection(firestore, 'asm4_sessions'), sessionData);
      if (docRef) {
        setSessionId(docRef.id);
        setStep('scenarios');
      }
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Failed to start assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNextQuestion = () => {
    const currentScenarioData = SCENARIOS[currentScenario];
    if (currentQuestion < currentScenarioData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setCurrentQuestion(0);
    } else {
      handleCompleteAssessment();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentScenario > 0) {
      setCurrentScenario(currentScenario - 1);
      setCurrentQuestion(SCENARIOS[currentScenario - 1].questions.length - 1);
    }
  };

  const handleCompleteAssessment = async () => {
    if (!firestore || !sessionId || !user) return;
    
    setIsLoading(true);
    
    const scores = calculateSocialAnxietyIndex(answers);
    
    const reportData = {
      userId: user.uid,
      sessionId,
      assessment: 'ASM-4',
      answers,
      warmupData,
      scores,
      completedAt: serverTimestamp()
    };

    try {
      // Update session
      const sessionRef = doc(firestore, 'asm4_sessions', sessionId);
      await setDocumentNonBlocking(sessionRef, { 
        status: 'completed', 
        completedAt: serverTimestamp(),
        answers,
        scores
      }, { merge: true });

      // Create report
      await addDocumentNonBlocking(collection(firestore, 'asm4_reports'), reportData);
      
      // Refresh assessment statuses
      refreshStatuses();
      
      setReport({ ...scores, reflection: warmupData.reflection });
      setStep('report');
    } catch (error) {
      console.error('Error completing assessment:', error);
      toast({
        title: "Error",
        description: "Failed to complete assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetake = () => {
    setStep('warmup');
    setCurrentScenario(0);
    setCurrentQuestion(0);
    setAnswers({});
    setWarmupData(null);
    setReport(null);
    setSessionId(null);
  };

  if (isUserLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-4 text-lg">Loading...</span>
      </div>
    );
  }

  if (!user) return null;

  if (step === 'report' && report) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:underline">Home</Link> / <Link href="/assessments" className="hover:underline">Assessments</Link> / Social Anxiety Scenarios (ASM4)
        </nav>
        <ReportView report={report} onRetake={handleRetake} />
      </div>
    );
  }

  if (step === 'scenarios') {
    const currentScenarioData = SCENARIOS[currentScenario];
    const isLastScenario = currentScenario === SCENARIOS.length - 1;
    const isLastQuestion = currentQuestion === currentScenarioData.questions.length - 1;

    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <nav className="text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">Home</Link> / <Link href="/assessments" className="hover:underline">Assessments</Link> / Social Anxiety Scenarios (ASM4)
        </nav>
        
        <MindfulnessAudio 
          isPlaying={mindfulnessPlaying} 
          onToggle={() => setMindfulnessPlaying(!mindfulnessPlaying)} 
        />
        
        <AnimatePresence mode="wait">
          <ScenarioComponent
            key={`${currentScenario}-${currentQuestion}`}
            scenario={currentScenarioData}
            currentQuestion={currentQuestion}
            answers={answers}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            onPrev={handlePrevQuestion}
            isLast={isLastScenario && isLastQuestion}
          />
        </AnimatePresence>
      </div>
    );
  }

  // Warm-up step
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:underline">Home</Link> / <Link href="/assessments" className="hover:underline">Assessments</Link> / Social Anxiety Scenarios (ASM4)
      </nav>
      <WarmupSection onSubmit={handleWarmupSubmit} />
    </div>
  );
}
