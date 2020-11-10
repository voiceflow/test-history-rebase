import { DiagramNode } from '@voiceflow/api-sdk';

export type PrimativeDiagram = {
  offsetX: number;
  offsetY: number;
  zoom: number;
  variables: string[];
  nodes: Record<string, DiagramNode>;
  children: string[];
};

export type StructuredFlow = {
  id: string;
  name: string;
  children: StructuredFlow[];
  parents: StructuredFlow[];
};
