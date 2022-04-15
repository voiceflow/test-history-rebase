import { BaseModels } from '@voiceflow/base-types';

export interface Diagram {
  id: string;
  type: BaseModels.Diagram.DiagramType;
  name: string;
  variables: string[];
  subDiagrams: string[];
  intentStepIDs: string[];
}

export interface DBDiagram extends Pick<BaseModels.Diagram.Model, '_id' | 'type' | 'name' | 'variables' | 'children' | 'intentStepIDs'> {}
