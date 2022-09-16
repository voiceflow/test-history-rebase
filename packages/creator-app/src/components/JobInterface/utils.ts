export const getProgress = (stage?: { data?: Record<string, unknown> }): number => {
  const progress = stage?.data?.progress;
  return typeof progress === 'number' ? progress : 0;
};
