import { useState, useCallback, useMemo } from 'react';
import { Criterion, Alternative, calculateWeights, synthesize } from '../lib/ahp';
import toast from 'react-hot-toast';

export function useAHP() {
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: 'c1', name: 'Prix' },
    { id: 'c2', name: 'Qualité' },
    { id: 'c3', name: 'Délai' },
  ]);

  const [alternatives, setAlternatives] = useState<Alternative[]>([
    { id: 'a1', name: 'Option A' },
    { id: 'a2', name: 'Option B' },
  ]);

  // Comparison matrix for criteria (n x n)
  // Initially identity matrix
  const [criteriaMatrix, setCriteriaMatrix] = useState<number[][]>([
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ]);

  // Scores for alternatives vs criteria: Record<criterionId, Record<alternativeId, score>>
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({});

  const updateCriteriaMatrix = useCallback((row: number, col: number, value: number) => {
    setCriteriaMatrix(prev => {
      const newMatrix = prev.map(r => [...r]);
      newMatrix[row][col] = value;
      newMatrix[col][row] = 1 / value; // Reciprocal
      return newMatrix;
    });
  }, []);

  const addCriterion = useCallback((name: string) => {
    const id = `c${Date.now()}`;
    setCriteria(prev => [...prev, { id, name }]);
    setCriteriaMatrix(prev => {
      const n = prev.length + 1;
      const newMatrix = Array(n).fill(0).map(() => Array(n).fill(1));
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - 1; j++) {
          newMatrix[i][j] = prev[i][j];
        }
      }
      return newMatrix;
    });
  }, []);

  const removeCriterion = useCallback((id: string) => {
    if (criteria.length <= 3) {
      toast.error("Il faut au moins 3 critères pour une analyse cohérente.");
      return;
    }
    const index = criteria.findIndex(c => c.id === id);
    setCriteria(prev => prev.filter(c => c.id !== id));
    setCriteriaMatrix(prev => {
      const newMatrix = prev.filter((_, i) => i !== index)
                           .map(row => row.filter((_, j) => j !== index));
      return newMatrix;
    });
  }, [criteria]);

  const addAlternative = useCallback((name: string) => {
    const id = `a${Date.now()}`;
    setAlternatives(prev => [...prev, { id, name }]);
  }, []);

  const removeAlternative = useCallback((id: string) => {
    if (alternatives.length <= 2) {
      toast.error("Il faut au moins 2 alternatives.");
      return;
    }
    setAlternatives(prev => prev.filter(a => a.id !== id));
  }, [alternatives]);

  const updateScore = useCallback((criterionId: string, alternativeId: string, value: number) => {
    setScores(prev => ({
      ...prev,
      [criterionId]: {
        ...(prev[criterionId] || {}),
        [alternativeId]: value
      }
    }));
  }, []);

  const reset = useCallback(() => {
    setCriteria([
        { id: 'c1', name: 'Coût' },
        { id: 'c2', name: 'Performance' },
        { id: 'c3', name: 'Fiabilité' },
    ]);
    setAlternatives([
        { id: 'a1', name: 'Fournisseur X' },
        { id: 'a2', name: 'Fournisseur Y' },
    ]);
    setCriteriaMatrix([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
    ]);
    setScores({});
    toast.success("Réinitialisé !");
  }, []);

const results = useMemo(() => {
  const { weights = [], cr = 0 } = calculateWeights(criteriaMatrix) || {};

  if (!weights.length || weights.length !== criteria.length) {
    return {
      criteriaWeights: {},
      consistencyRatio: 0,
      isConsistent: true,
      ranking: []
    };
  }

  const itemScores: number[][] = criteria.map((c) => {
    const rawScores = alternatives.map(a => scores[c.id]?.[a.id] || 0);
    const sum = rawScores.reduce((a, b) => a + b, 0) || 1;
    return rawScores.map(s => s / sum);
  });

  const finalScoresArray = synthesize(weights, itemScores) || [];

  const finalResults = alternatives.map((a, i) => ({
    id: a.id,
    name: a.name,
    score: (finalScoresArray[i] || 0) * 100
  })).sort((a, b) => b.score - a.score);

  return {
    criteriaWeights: criteria.reduce(
      (acc, c, i) => ({ ...acc, [c.name]: (weights[i] || 0) * 100 }),
      {}
    ),
    consistencyRatio: cr,
    isConsistent: cr < 0.1,
    ranking: finalResults
  };
}, [criteria, alternatives, criteriaMatrix, scores]);



  return {
    criteria,
    alternatives,
    criteriaMatrix,
    scores,
    updateCriteriaMatrix,
    addCriterion,
    removeCriterion,
    addAlternative,
    removeAlternative,
    updateScore,
    reset,
    results
  };
}
