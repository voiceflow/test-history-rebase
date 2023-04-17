export enum SimilarityColors {
  STRONG = '#38751F',
  MEDIUM = '#4E8BBD',
  WEAK = '#BD425F',
}

export const getSimilarityStrength = (similarity: number) => {
  if (similarity >= 80) return SimilarityColors.STRONG;
  if (similarity >= 70) return SimilarityColors.MEDIUM;
  return SimilarityColors.WEAK;
};
