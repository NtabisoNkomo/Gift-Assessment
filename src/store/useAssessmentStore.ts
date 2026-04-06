import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AssessmentState {
  answers: Record<number, number>;
  setAnswer: (questionId: number, value: number) => void;
  reset: () => void;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      answers: {},
      setAnswer: (questionId, value) => 
        set((state) => ({ answers: { ...state.answers, [questionId]: value } })),
      reset: () => set({ answers: {} }),
    }),
    {
      name: 'spiritual-gifts-assessment',
    }
  )
);
