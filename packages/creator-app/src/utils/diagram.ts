import { ROOT_DIAGRAM_LABEL, ROOT_DIAGRAM_NAME } from '@/constants';

// eslint-disable-next-line import/prefer-default-export
export const getDiagramName = (diagramName?: string): string => {
  if (!diagramName) return 'Unkown';
  if (diagramName === ROOT_DIAGRAM_NAME) return ROOT_DIAGRAM_LABEL;
  return diagramName;
};
