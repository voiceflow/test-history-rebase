import { Diagram as DBFullDiagram, DiagramType } from '@voiceflow/api-sdk';

export interface Diagram {
  id: string;
  type: DiagramType;
  name: string;
  variables: string[];
  subDiagrams: string[];
  intentStepIDs: string[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DBDiagram extends Pick<DBFullDiagram, '_id' | 'type' | 'name' | 'variables' | 'children' | 'intentStepIDs'> {}
