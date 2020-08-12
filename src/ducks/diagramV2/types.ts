import { DiagramNode } from '@voiceflow/api-sdk';

export type PrimativeDiagram = {
  offsetX: number;
  offsetY: number;
  zoom: number;
  variables: string[];
  nodes: Record<string, DiagramNode>;
};
