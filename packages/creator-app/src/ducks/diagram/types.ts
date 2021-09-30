import { BaseDiagramNode, DiagramType } from '@voiceflow/api-sdk';

export interface PrimitiveDiagram {
  zoom: number;
  nodes: Record<string, BaseDiagramNode>;
  offsetX: number;
  offsetY: number;
  children: string[];
  variables: string[];
  intentStepIDs: string[];
}

export interface PrimitiveTopicDiagram extends PrimitiveDiagram {
  type: DiagramType.TOPIC;
}

export interface PrimitiveComponentDiagram extends PrimitiveDiagram {
  type: DiagramType.COMPONENT;
}

export interface StructuredFlow {
  id: string;
  name: string;
  children: StructuredFlow[];
  parents: StructuredFlow[];
}
