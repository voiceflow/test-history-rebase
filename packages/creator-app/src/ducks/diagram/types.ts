import { BaseDiagramNode } from '@voiceflow/api-sdk';

export interface PrimitiveDiagram {
  offsetX: number;
  offsetY: number;
  zoom: number;
  variables: string[];
  nodes: Record<string, BaseDiagramNode>;
  children: string[];
}
export interface StructuredFlow {
  id: string;
  name: string;
  children: StructuredFlow[];
  parents: StructuredFlow[];
}
