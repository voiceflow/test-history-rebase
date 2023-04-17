export const getScale = (containerNode: HTMLDivElement | null, dimension: { width: number; height: number }): number => {
  if (!containerNode) {
    return 1;
  }

  const { width, height } = containerNode.getBoundingClientRect();

  const scaleX = width / dimension.width;
  const scaleY = height / dimension.height;

  return Math.min(scaleX, scaleY);
};
