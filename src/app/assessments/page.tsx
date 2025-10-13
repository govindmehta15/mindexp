
'use client';

import { useState } from 'react';
import { assessments } from '@/lib/assessments-data';
import type { Assessment } from '@/lib/types';
import { useAssessmentStatusContext } from '@/contexts/AssessmentStatusContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Book,
  ClipboardCheck,
  Clock,
  ListFilter,
  MonitorPlay,
  FileText,
  MessageSquare,
  CheckCircle,
  PlayCircle,
  Circle,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

const iconMap = {
  MCQ: ClipboardCheck,
  'Video + Quiz': MonitorPlay,
  'Reading + Essay': Book,
  'Peer Review': MessageSquare,
};

const AssessmentCard = ({ 
  assessment, 
  status 
}: { 
  assessment: Assessment;
  status: {
    id: string;
    status: 'completed' | 'in_progress' | 'not_started';
    lastAttempt?: Date;
    attempts?: number;
    score?: number;
    reportId?: string;
  };
}) => {
  const Icon =
    iconMap[assessment.type as keyof typeof iconMap] || ClipboardCheck;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Completed
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <PlayCircle className="w-3 h-3" />
            In Progress
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Circle className="w-3 h-3" />
            Not Started
          </Badge>
        );
    }
  };

  const getButtonText = () => {
    switch (status.status) {
      case 'completed':
        return 'View Report';
      case 'in_progress':
        return 'Continue Assessment';
      default:
        return 'Start Assessment';
    }
  };

  const getButtonVariant = () => {
    switch (status.status) {
      case 'completed':
        return 'outline';
      case 'in_progress':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          {getStatusBadge(status.status)}
        </div>
        <CardTitle className="font-headline pt-2">{assessment.title}</CardTitle>
        <CardDescription>{assessment.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-2" />
            <span>{assessment.estimatedTime} min</span>
            <span className="mx-2">|</span>
            <Badge variant="secondary">{assessment.topic}</Badge>
          </div>
          
          {status.status === 'completed' && status.lastAttempt && (
            <div className="text-xs text-muted-foreground">
              Completed {status.lastAttempt.toLocaleDateString()}
              {status.attempts && status.attempts > 1 && (
                <span> • {status.attempts} attempts</span>
              )}
            </div>
          )}
          
          {status.status === 'in_progress' && status.lastAttempt && (
            <div className="text-xs text-muted-foreground">
              Started {status.lastAttempt.toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={getButtonVariant()}
          asChild
        >
          <Link href={`/assessments/${assessment.id}`}>
            {getButtonText()}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function AssessmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  
  const { assessmentStatuses, progress, isLoading, getAssessmentStatus } = useAssessmentStatusContext();

  const topics = [...new Set(assessments.map((a) => a.topic))];

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch = assessment.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTopic =
      topicFilter === 'all' || assessment.topic === topicFilter;
    return matchesSearch && matchesTopic;
  });

  if (isLoading) {
    return (
      <div className="bg-background text-foreground">
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-3">
              Student Assessments
            </h1>
            <p className="text-lg md:text-xl max-w-3xl text-muted-foreground mb-8">
              Learn, Assess, and Grow — Your Personalized Feedback Awaits.
            </p>
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-4 text-lg">Loading your progress...</span>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground">
      {/* 1. Header Section */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-3">
            Student Assessments
          </h1>
          <p className="text-lg md:text-xl max-w-3xl text-muted-foreground mb-8">
            Learn, Assess, and Grow — Your Personalized Feedback Awaits.
          </p>
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Assessments Completed
                </span>
                <span className="font-semibold">
                  {progress.completed} / {progress.total}
                </span>
              </div>
              <Progress value={progress.completionPercentage} />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{progress.completed} completed</span>
                <span>{progress.inProgress} in progress</span>
                <span>{progress.notStarted} not started</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2. Assessment Dashboard */}
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-16 bg-background/95 backdrop-blur-sm z-10 py-4">
          <Input
            placeholder="Search assessments..."
            className="md:max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select onValueChange={setTopicFilter} defaultValue="all">
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {topics.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.length > 0 ? (
            filteredAssessments.map((assessment) => {
              const status = getAssessmentStatus(assessment.id);
              return (
                <AssessmentCard 
                  key={assessment.id} 
                  assessment={assessment} 
                  status={status}
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold">No assessments found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
