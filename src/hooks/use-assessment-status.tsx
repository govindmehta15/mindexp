'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export interface AssessmentStatus {
  id: string;
  status: 'completed' | 'in_progress' | 'not_started';
  lastAttempt?: Date;
  attempts?: number;
  score?: number;
  reportId?: string;
}

export interface AssessmentProgress {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  completionPercentage: number;
}

export function useAssessmentStatus() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [assessmentStatuses, setAssessmentStatuses] = useState<Record<string, AssessmentStatus>>({});
  const [progress, setProgress] = useState<AssessmentProgress>({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    completionPercentage: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !firestore) {
      setIsLoading(false);
      return;
    }

    const fetchAssessmentStatuses = async () => {
      try {
        setIsLoading(true);
        
        // Define all assessment collections
        const assessmentCollections = [
          { id: 'asm1', collection: 'asm1_sessions' },
          { id: 'asm2', collection: 'asm2_sessions' },
          { id: 'asm3', collection: 'asm3_sessions' },
          { id: 'asm4', collection: 'asm4_sessions' },
          { id: 'asm-5', collection: 'asm5_sessions' },
          { id: 'asm-6', collection: 'asm6_sessions' }
        ];

        const statuses: Record<string, AssessmentStatus> = {};
        let totalCompleted = 0;
        let totalInProgress = 0;

        // Fetch status for each assessment
        for (const assessment of assessmentCollections) {
          try {
            const sessionsQuery = query(
              collection(firestore, assessment.collection),
              where('userId', '==', user.uid)
            );
            
            const sessionsSnapshot = await getDocs(sessionsQuery);
            
            if (sessionsSnapshot.empty) {
              statuses[assessment.id] = {
                id: assessment.id,
                status: 'not_started'
              };
            } else {
              const sessions = sessionsSnapshot.docs
                .map(doc => ({
                  id: doc.id,
                  ...doc.data()
                }))
                .sort((a, b) => {
                  // Sort by startedAt descending (most recent first)
                  const aTime = a.startedAt?.toDate?.() || new Date(0);
                  const bTime = b.startedAt?.toDate?.() || new Date(0);
                  return bTime.getTime() - aTime.getTime();
                });

              // Check if any session is completed
              const completedSession = sessions.find(session => session.status === 'completed');
              const inProgressSession = sessions.find(session => session.status === 'in_progress');

              if (completedSession) {
                statuses[assessment.id] = {
                  id: assessment.id,
                  status: 'completed',
                  lastAttempt: completedSession.completedAt?.toDate() || completedSession.startedAt?.toDate(),
                  attempts: sessions.length,
                  score: completedSession.scores?.total || completedSession.score,
                  reportId: completedSession.reportId
                };
                totalCompleted++;
              } else if (inProgressSession) {
                statuses[assessment.id] = {
                  id: assessment.id,
                  status: 'in_progress',
                  lastAttempt: inProgressSession.startedAt?.toDate(),
                  attempts: sessions.length
                };
                totalInProgress++;
              } else {
                // Has sessions but none completed or in progress (stopped/abandoned)
                statuses[assessment.id] = {
                  id: assessment.id,
                  status: 'not_started',
                  attempts: sessions.length
                };
              }
            }
          } catch (error) {
            console.error(`Error fetching status for ${assessment.id}:`, error);
            // Default to not started if there's an error
            statuses[assessment.id] = {
              id: assessment.id,
              status: 'not_started'
            };
          }
        }

        setAssessmentStatuses(statuses);

        // Calculate progress
        const total = assessmentCollections.length;
        const notStarted = total - totalCompleted - totalInProgress;
        const completionPercentage = total > 0 ? Math.round((totalCompleted / total) * 100) : 0;

        setProgress({
          total,
          completed: totalCompleted,
          inProgress: totalInProgress,
          notStarted,
          completionPercentage
        });

      } catch (error) {
        console.error('Error fetching assessment statuses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessmentStatuses();
  }, [user, firestore]);

  const getAssessmentStatus = (assessmentId: string): AssessmentStatus => {
    return assessmentStatuses[assessmentId] || {
      id: assessmentId,
      status: 'not_started'
    };
  };

  const refreshStatuses = () => {
    if (user && firestore) {
      // Re-trigger the effect by updating a dependency
      setAssessmentStatuses({});
    }
  };

  return {
    assessmentStatuses,
    progress,
    isLoading,
    getAssessmentStatus,
    refreshStatuses
  };
}
