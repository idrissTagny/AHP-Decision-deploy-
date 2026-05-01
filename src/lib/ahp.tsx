/**
 * Analytic Hierarchy Process (AHP) Logic
 */

export interface Criterion {
  id: string;
  name: string;
}

export interface Alternative {
  id: string;
  name: string;
}

export interface AHPResult {
  weights: Record<string, number>;
  consistencyRatio: number;
  isConsistent: boolean;
  finalScores: { id: string; name: string; score: number }[];
}

// Random Index values for AHP 
const RANDOM_INDEX: Record<number, number> = {
  1: 0.00,
  2: 0.00,
  3: 0.58,
  4: 0.90,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
};

/**
 * Calculates weights from a pairwise comparison matrix
 */
export function calculateWeights(matrix: number[][]): { weights: number[]; lambdaMax: number; ci: number; cr: number } {
  const n = matrix.length;
  
  // 1. Calculate the column sums
  const colSums = new Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      colSums[j] += matrix[i][j];
    }
  }

  // 2. Normalize and calculate weights (averaging across rows)
  const weights = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let rowSum = 0;
    for (let j = 0; j < n; j++) {
      rowSum += matrix[i][j] / colSums[j];
    }
    weights[i] = rowSum / n;
  }

  // 3. Calculate Consistency
  // lambdaMax = sum(colSum_j * weight_j)
  let lambdaMax = 0;
  for (let j = 0; j < n; j++) {
    lambdaMax += colSums[j] * weights[j];
  }

  const ci = (lambdaMax - n) / (n - 1);
  const ri = RANDOM_INDEX[n] || 1.49;
  const cr = n <= 2 ? 0 : ci / ri;

  return { weights, lambdaMax, ci, cr };
}

/**
 * Full AHP Synthesis
 */
export function synthesize(
  criteriaWeights: number[],
  alternativesScores: number[][] // alternativesScores[criterionIndex][alternativeIndex]
): number[] {
  const numAlternatives = alternativesScores[0].length;
  const numCriteria = criteriaWeights.length;
  const finalScores = new Array(numAlternatives).fill(0);

  for (let i = 0; i < numAlternatives; i++) {
    for (let j = 0; j < numCriteria; j++) {
      finalScores[i] += alternativesScores[j][i] * criteriaWeights[j];
    }
  }

  return finalScores;
}
