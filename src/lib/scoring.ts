import { spiritualGifts, Gift } from '@/data/gifts';
import { assessmentQuestions } from '@/data/questions';

export interface GiftScore {
  gift: Gift;
  score: number;
  percentage: number;
}

export interface AssessmentResult {
  primaryGifts: GiftScore[];
  secondaryGifts: GiftScore[];
  allScores: GiftScore[];
}

export function calculateScores(answers: Record<number, number>): AssessmentResult {
  // Max score per gift is 5 questions * 3 = 15
  const MAX_SCORE = 15;

  const scoresMap: Record<number, number> = {};
  
  // Initialize scores to 0
  spiritualGifts.forEach(g => {
    scoresMap[g.id] = 0;
  });

  // Calculate scores
  assessmentQuestions.forEach(q => {
    const answerValue = answers[q.id] || 0;
    scoresMap[q.giftId] += answerValue;
  });

  // Map to GiftScore array
  const allScores: GiftScore[] = spiritualGifts.map(gift => ({
    gift,
    score: scoresMap[gift.id],
    percentage: Math.round((scoresMap[gift.id] / MAX_SCORE) * 100)
  }));

  // Sort descending by score
  allScores.sort((a, b) => b.score - a.score);

  return {
    primaryGifts: allScores.slice(0, 3),
    secondaryGifts: allScores.slice(3, 6),
    allScores
  };
}
