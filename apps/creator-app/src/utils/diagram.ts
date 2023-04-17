import { ROOT_DIAGRAM_LABEL, ROOT_DIAGRAM_NAME } from '@/constants';

export const getDiagramName = (diagramName?: string): string => {
  if (!diagramName) return 'Unknown';

  if (diagramName === ROOT_DIAGRAM_NAME) return ROOT_DIAGRAM_LABEL;

  return diagramName;
};
