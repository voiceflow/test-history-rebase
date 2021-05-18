import { DiagramNode } from '@voiceflow/api-sdk';

export type PrimitiveDiagram = {
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
