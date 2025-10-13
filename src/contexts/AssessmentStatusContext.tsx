'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { useAssessmentStatus } from '@/hooks/use-assessment-status';

interface AssessmentStatusContextType {
  refreshStatuses: () => void;
  assessmentStatuses: Record<string, any>;
  progress: any;
  isLoading: boolean;
  getAssessmentStatus: (assessmentId: string) => any;
}

const AssessmentStatusContext = createContext<AssessmentStatusContextType | undefined>(undefined);

export function AssessmentStatusProvider({ children }: { children: React.ReactNode }) {
  const assessmentStatusHook = useAssessmentStatus();

  const refreshStatuses = useCallback(() => {
    assessmentStatusHook.refreshStatuses();
  }, [assessmentStatusHook]);

  return (
    <AssessmentStatusContext.Provider
      value={{
        ...assessmentStatusHook,
        refreshStatuses
      }}
    >
      {children}
    </AssessmentStatusContext.Provider>
  );
}

export function useAssessmentStatusContext() {
  const context = useContext(AssessmentStatusContext);
  if (context === undefined) {
    throw new Error('useAssessmentStatusContext must be used within an AssessmentStatusProvider');
  }
  return context;
}
