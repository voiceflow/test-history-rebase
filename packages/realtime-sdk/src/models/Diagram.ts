import { BaseModels } from '@voiceflow/base-types';

export interface Diagram {
  id: string;
  type: BaseModels.Diagram.DiagramType;
  name: string;
  variables: string[];
  menuNodeIDs: string[];
  subDiagrams: string[];
}

export interface DBDiagram extends Pick<BaseModels.Diagram.Model, '_id' | 'type' | 'name' | 'variables' | 'children' | 'menuNodeIDs'> {}
