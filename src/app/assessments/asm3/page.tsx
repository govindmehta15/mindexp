'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { 
  Loader2, 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Settings, 
  Clock, 
  Heart, 
  Brain, 
  CheckCircle,
  AlertCircle,
  Music,
  Wind,
  Waves,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { collection, doc, serverTimestamp, where, query, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

// Session configuration
const SESSION_TYPES = [
  { id: 'breathing', name: 'Breathing Only', duration: 5, description: 'Quick 4-4-4-4 box breathing' },
  { id: 'mindfulness', name: 'Mindfulness + Breathing', duration: 10, description: 'Breathing with body awareness' },
  { id: 'loving_kindness', name: 'Mindfulness + Loving-kindness', duration: 20, description: 'Breathing with compassion practice' }
];

// Music tracks
const MUSIC_TRACKS = [
  { id: 'ambient', name: 'Ambient Pad', icon: Music, description: 'Soft ambient textures' },
  { id: 'nature', name: 'Nature Sounds', icon: Wind, description: 'Ocean and wind sounds' },
  { id: 'waves', name: 'Ocean Waves', icon: Waves, description: 'Gentle wave sounds' },
  { id: 'none', name: 'No Music', icon: VolumeX, description: 'Silent practice' }
];

// Breathing patterns
const BREATHING_PATTERNS = {
  breathing: [4, 4, 4, 4], // inhale, hold, exhale, hold
  mindfulness: [4, 4, 4, 4],
  loving_kindness: [4, 4, 4, 4]
};

// Pre-session check component
function PreCheckForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) {
  const [calmness, setCalmness] = useState([5]);
  const [stress, setStress] = useState([5]);
  const [attention, setAttention] = useState([5]);
  const [mood, setMood] = useState('neutral');

  const handleSubmit = () => {
    onSubmit({
      calmness: calmness[0],
      stress: stress[0],
      attention: attention[0],
      mood
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Pre-Session Check</CardTitle>
        <CardDescription>Let's check in with how you're feeling right now</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              How calm do you feel right now? (0 = very agitated, 10 = completely calm)
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">0</span>
              <Slider
                value={calmness}
                onValueChange={setCalmness}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">10</span>
              <Badge variant="secondary" className="min-w-[3rem]">{calmness[0]}</Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              How stressed do you feel right now? (0 = no stress, 10 = extremely stressed)
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">0</span>
              <Slider
                value={stress}
                onValueChange={setStress}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">10</span>
              <Badge variant="secondary" className="min-w-[3rem]">{stress[0]}</Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              How focused is your attention right now? (0 = very distracted, 10 = completely focused)
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">0</span>
              <Slider
                value={attention}
                onValueChange={setAttention}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">10</span>
              <Badge variant="secondary" className="min-w-[3rem]">{attention[0]}</Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Current mood</label>
            <div className="flex gap-2">
              {['😊', '😐', '😟', '😢', '😡'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setMood(emoji)}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    mood === emoji ? 'border-primary bg-primary/10' : 'border-muted hover:border-primary/50'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Start Session</Button>
      </CardFooter>
    </Card>
  );
}

// Breathing visualizer component
function BreathingVisualizer({ 
  isPlaying, 
  pattern, 
  currentPhase, 
  progress 
}: { 
  isPlaying: boolean; 
  pattern: number[]; 
  currentPhase: number; 
  progress: number; 
}) {
  const totalDuration = pattern.reduce((sum, phase) => sum + phase, 0);
  const currentPhaseDuration = pattern[currentPhase];
  const phaseProgress = progress / currentPhaseDuration;
  
  // Calculate scale based on breathing phase
  let scale = 1;
  if (currentPhase === 0) { // Inhale
    scale = 1 + (phaseProgress * 0.5);
  } else if (currentPhase === 1) { // Hold
    scale = 1.5;
  } else if (currentPhase === 2) { // Exhale
    scale = 1.5 - (phaseProgress * 0.5);
  } else { // Hold
    scale = 1;
  }

  const phaseNames = ['Inhale', 'Hold', 'Exhale', 'Hold'];
  const phaseColors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <div
          className="absolute w-32 h-32 rounded-full border-4 transition-all duration-300 ease-in-out"
          style={{
            transform: `scale(${scale})`,
            borderColor: phaseColors[currentPhase],
            backgroundColor: `${phaseColors[currentPhase]}20`
          }}
        />
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{phaseNames[currentPhase]}</div>
          <div className="text-sm text-muted-foreground">
            {Math.ceil(currentPhaseDuration - progress)}s
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-md">
        <Progress value={(progress / currentPhaseDuration) * 100} className="h-2" />
      </div>
    </div>
  );
}

// Music player component
function MusicPlayer({ 
  selectedTrack, 
  onTrackChange, 
  volume, 
  onVolumeChange, 
  isPlaying, 
  onToggle 
}: {
  selectedTrack: string;
  onTrackChange: (track: string) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  isPlaying: boolean;
  onToggle: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-lg">Background Music</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {MUSIC_TRACKS.map(track => {
            const Icon = track.icon;
            return (
              <button
                key={track.id}
                onClick={() => onTrackChange(track.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedTrack === track.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-muted hover:border-primary/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{track.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{track.description}</p>
              </button>
            );
          })}
        </div>
        
        {selectedTrack !== 'none' && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onToggle}
                className="flex items-center space-x-1"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </Button>
              <Volume2 className="w-4 h-4 text-muted-foreground" />
            </div>
            <Slider
              value={[volume]}
              onValueChange={(value) => onVolumeChange(value[0])}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Session controller component
function SessionController({ 
  sessionType, 
  onComplete, 
  onStop 
}: {
  sessionType: string;
  onComplete: () => void;
  onStop: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState('ambient');
  const [volume, setVolume] = useState(0.5);
  const [musicPlaying, setMusicPlaying] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const pattern = BREATHING_PATTERNS[sessionType as keyof typeof BREATHING_PATTERNS];
  const sessionDuration = SESSION_TYPES.find(t => t.id === sessionType)?.duration || 10;
  const totalSeconds = sessionDuration * 60;

  useEffect(() => {
    setTimeRemaining(totalSeconds);
  }, [sessionDuration, totalSeconds]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          const currentPhaseDuration = pattern[currentPhase];
          if (prev >= currentPhaseDuration - 1) {
            // Move to next phase
            const nextPhase = (currentPhase + 1) % pattern.length;
            setCurrentPhase(nextPhase);
            return 0;
          }
          return prev + 1;
        });
        
        setTimeRemaining(prev => {
          if (prev <= 1) {
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentPhase, pattern, onComplete]);

  useEffect(() => {
    if (audioRef.current) {
      if (musicPlaying && selectedTrack !== 'none') {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [musicPlaying, selectedTrack]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <audio ref={audioRef} src="/media/asm3/ambient.mp3" loop />
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-headline text-2xl">
                {SESSION_TYPES.find(t => t.id === sessionType)?.name}
              </CardTitle>
              <CardDescription>
                {SESSION_TYPES.find(t => t.id === sessionType)?.description}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{formatTime(timeRemaining)}</div>
              <div className="text-sm text-muted-foreground">remaining</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <BreathingVisualizer
            isPlaying={isPlaying}
            pattern={pattern}
            currentPhase={currentPhase}
            progress={progress}
          />
          
          <div className="flex justify-center space-x-4">
            {!isPlaying ? (
              <Button size="lg" onClick={() => setIsPlaying(true)} className="bg-green-600 hover:bg-green-700">
                <Play className="mr-2" />
                Start Practice
              </Button>
            ) : (
              <Button size="lg" variant="outline" onClick={() => setIsPlaying(false)}>
                <Pause className="mr-2" />
                Pause
              </Button>
            )}
            <Button size="lg" variant="destructive" onClick={onStop}>
              <Square className="mr-2" />
              Stop
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <MusicPlayer
          selectedTrack={selectedTrack}
          onTrackChange={setSelectedTrack}
          volume={volume}
          onVolumeChange={setVolume}
          isPlaying={musicPlaying}
          onToggle={() => setMusicPlaying(!musicPlaying)}
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start space-x-2">
              <Heart className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <span>Find a comfortable position and minimize distractions</span>
            </div>
            <div className="flex items-start space-x-2">
              <Brain className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>It's normal for your mind to wander - gently return to your breath</span>
            </div>
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Consistent daily practice builds lasting benefits</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Post-session check component
function PostCheckForm({ 
  preData, 
  onSubmit, 
  onCancel 
}: { 
  preData: any; 
  onSubmit: (data: any) => void; 
  onCancel: () => void; 
}) {
  const [calmness, setCalmness] = useState([5]);
  const [stress, setStress] = useState([5]);
  const [mindfulness, setMindfulness] = useState([5]);
  const [suds, setSuds] = useState([5]);
  const [helpfulness, setHelpfulness] = useState([3]);
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    onSubmit({
      calmness: calmness[0],
      stress: stress[0],
      mindfulness: mindfulness[0],
      suds: suds[0],
      helpfulness: helpfulness[0],
      note
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Post-Session Check</CardTitle>
        <CardDescription>How do you feel after your practice?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              How calm do you feel now? (0 = very agitated, 10 = completely calm)
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">0</span>
              <Slider
                value={calmness}
                onValueChange={setCalmness}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">10</span>
              <Badge variant="secondary" className="min-w-[3rem]">{calmness[0]}</Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Before: {preData.calmness} → After: {calmness[0]} (Change: {calmness[0] - preData.calmness > 0 ? '+' : ''}{calmness[0] - preData.calmness})
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              How stressed do you feel now? (0 = no stress, 10 = extremely stressed)
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">0</span>
              <Slider
                value={stress}
                onValueChange={setStress}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">10</span>
              <Badge variant="secondary" className="min-w-[3rem]">{stress[0]}</Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Before: {preData.stress} → After: {stress[0]} (Change: {stress[0] - preData.stress > 0 ? '+' : ''}{stress[0] - preData.stress})
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              How present did you feel during the practice? (0 = very distracted, 10 = completely present)
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">0</span>
              <Slider
                value={mindfulness}
                onValueChange={setMindfulness}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">10</span>
              <Badge variant="secondary" className="min-w-[3rem]">{mindfulness[0]}</Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              How helpful was this session? (1 = not helpful, 5 = very helpful)
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">1</span>
              <Slider
                value={helpfulness}
                onValueChange={setHelpfulness}
                max={5}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">5</span>
              <Badge variant="secondary" className="min-w-[3rem]">{helpfulness[0]}</Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              One word to describe how you feel after the session (optional)
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., calm, centered, relaxed..."
              rows={2}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Skip</Button>
        <Button onClick={handleSubmit}>Complete Session</Button>
      </CardFooter>
    </Card>
  );
}

// Report view component
function ReportView({ 
  report, 
  onRetake 
}: { 
  report: any; 
  onRetake: () => void; 
}) {
  const getCategory = (deltaCalmness: number) => {
    if (deltaCalmness >= 2) return { label: 'Significant Positive Effect', color: 'text-green-600', icon: CheckCircle };
    if (deltaCalmness >= 1) return { label: 'Moderate Positive Effect', color: 'text-blue-600', icon: CheckCircle };
    if (deltaCalmness >= -0.9) return { label: 'Neutral Effect', color: 'text-gray-600', icon: AlertCircle };
    return { label: 'Negative Effect', color: 'text-red-600', icon: AlertCircle };
  };

  const category = getCategory(report.delta.calmness);
  const Icon = category.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">ASM3 Report: Mindfulness & Breathing</CardTitle>
          <CardDescription>Your personalized session report and recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${category.color}`}>
                <Icon className="w-6 h-6" />
                <span>Session Category: {category.label}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">+{report.delta.calmness}</div>
                  <div className="text-sm text-muted-foreground">Calmness Change</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{report.delta.stress > 0 ? '+' : ''}{report.delta.stress}</div>
                  <div className="text-sm text-muted-foreground">Stress Change</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{report.helpfulness}/5</div>
                  <div className="text-sm text-muted-foreground">Helpfulness</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Session Type:</span>
                  <span className="font-medium">{SESSION_TYPES.find(t => t.id === report.sessionType)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{report.plannedLength / 60} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Completion:</span>
                  <span className="font-medium">{Math.round((report.completedSeconds / report.plannedLength) * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Music:</span>
                  <span className="font-medium">{MUSIC_TRACKS.find(t => t.id === report.track)?.name}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="text-primary" />
                  <span>Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {report.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {report.note && (
            <Card>
              <CardHeader>
                <CardTitle>Your Reflection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="italic text-muted-foreground">"{report.note}"</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={onRetake}>Practice Again</Button>
          <Button variant="outline" asChild>
            <Link href="/assessments">Back to Assessments</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Main ASM3 page component
export default function Asm3Page() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [step, setStep] = useState<'session-select' | 'pre-check' | 'session' | 'post-check' | 'report'>('session-select');
  const [selectedSessionType, setSelectedSessionType] = useState('mindfulness');
  const [preData, setPreData] = useState<any>(null);
  const [postData, setPostData] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/assessments/asm3');
    }
  }, [user, isUserLoading, router]);

  const handleSessionSelect = (sessionType: string) => {
    setSelectedSessionType(sessionType);
    setStep('pre-check');
  };

  const handlePreCheckSubmit = async (data: any) => {
    if (!firestore || !user) return;
    
    setIsLoading(true);
    setPreData(data);
    
    const sessionData = {
      userId: user.uid,
      sessionType: selectedSessionType,
      plannedLength: SESSION_TYPES.find(t => t.id === selectedSessionType)?.duration * 60 || 600,
      track: 'ambient',
      status: 'in_progress',
      startedAt: serverTimestamp(),
      preData: data
    };

    try {
      const docRef = await addDocumentNonBlocking(collection(firestore, 'asm3_sessions'), sessionData);
      if (docRef) {
        setSessionId(docRef.id);
        setStep('session');
      }
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Failed to start session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionComplete = () => {
    setStep('post-check');
  };

  const handleSessionStop = () => {
    setStep('post-check');
  };

  const handlePostCheckSubmit = async (data: any) => {
    if (!firestore || !sessionId || !user) return;
    
    setIsLoading(true);
    setPostData(data);
    
    // Calculate deltas
    const deltaCalmness = data.calmness - preData.calmness;
    const deltaStress = data.stress - preData.stress;
    
    // Generate recommendations
    const recommendations = [];
    if (deltaCalmness >= 2) {
      recommendations.push("Excellent session! Your calmness increased significantly.");
      recommendations.push("Try practicing daily for 7 days to build consistency.");
      recommendations.push("Consider trying the 20-minute loving-kindness practice.");
    } else if (deltaCalmness >= 1) {
      recommendations.push("Good session! You felt calmer after practice.");
      recommendations.push("Try 5-minute daily practices to build the habit.");
      recommendations.push("Consider joining our mindfulness challenge.");
    } else if (deltaCalmness >= -0.9) {
      recommendations.push("No immediate change today - this is normal.");
      recommendations.push("Consistency matters more than immediate effects.");
      recommendations.push("Try shorter 5-minute sessions if needed.");
    } else {
      recommendations.push("Sometimes practice can bring up feelings.");
      recommendations.push("Consider shorter sessions or grounding exercises.");
      recommendations.push("Reach out for support if you feel distressed.");
    }

    const reportData = {
      userId: user.uid,
      sessionId,
      sessionType: selectedSessionType,
      plannedLength: SESSION_TYPES.find(t => t.id === selectedSessionType)?.duration * 60 || 600,
      completedSeconds: SESSION_TYPES.find(t => t.id === selectedSessionType)?.duration * 60 || 600,
      track: 'ambient',
      pre: preData,
      post: data,
      delta: { calmness: deltaCalmness, stress: deltaStress },
      helpfulness: data.helpfulness,
      note: data.note,
      recommendations,
      completedAt: serverTimestamp()
    };

    try {
      // Update session
      const sessionRef = doc(firestore, 'asm3_sessions', sessionId);
      await setDocumentNonBlocking(sessionRef, { 
        status: 'completed', 
        completedAt: serverTimestamp(),
        postData: data,
        reportData
      }, { merge: true });

      // Create report
      await addDocumentNonBlocking(collection(firestore, 'asm3_reports'), reportData);
      
      setReport(reportData);
      setStep('report');
    } catch (error) {
      console.error('Error completing session:', error);
      toast({
        title: "Error",
        description: "Failed to complete session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetake = () => {
    setStep('session-select');
    setSessionId(null);
    setPreData(null);
    setPostData(null);
    setReport(null);
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
    return <ReportView report={report} onRetake={handleRetake} />;
  }

  if (step === 'post-check') {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:underline">Home</Link> / <Link href="/assessments" className="hover:underline">Assessments</Link> / Mindfulness & Breathing (ASM3)
        </nav>
        <PostCheckForm preData={preData} onSubmit={handlePostCheckSubmit} onCancel={() => setStep('session')} />
      </div>
    );
  }

  if (step === 'session') {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:underline">Home</Link> / <Link href="/assessments" className="hover:underline">Assessments</Link> / Mindfulness & Breathing (ASM3)
        </nav>
        <SessionController 
          sessionType={selectedSessionType} 
          onComplete={handleSessionComplete}
          onStop={handleSessionStop}
        />
      </div>
    );
  }

  if (step === 'pre-check') {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:underline">Home</Link> / <Link href="/assessments" className="hover:underline">Assessments</Link> / Mindfulness & Breathing (ASM3)
        </nav>
        <PreCheckForm onSubmit={handlePreCheckSubmit} onCancel={() => setStep('session-select')} />
      </div>
    );
  }

  // Session selection step
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <nav className="text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">Home</Link> / <Link href="/assessments" className="hover:underline">Assessments</Link> / Mindfulness & Breathing (ASM3)
      </nav>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Mindfulness & Breathing Exercise</CardTitle>
          <CardDescription>
            Choose a guided mindfulness practice to help you feel present and calm. 
            Each session includes breathing exercises and optional background music.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {SESSION_TYPES.map(session => (
              <Card key={session.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="font-headline text-lg">{session.name}</CardTitle>
                  <CardDescription>{session.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{session.duration} minutes</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleSessionSelect(session.id)}
                  >
                    Start {session.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Important Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive-foreground">
            This is a self-help mindfulness practice, not clinical therapy. If you are in immediate danger 
            or thinking about harming yourself, contact your local emergency services now.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
