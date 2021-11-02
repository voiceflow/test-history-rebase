import { Models as BaseModels } from '@voiceflow/base-types';

export interface Diagram {
  id: string;
  type: BaseModels.DiagramType;
  name: string;
  variables: string[];
  subDiagrams: string[];
  intentStepIDs: string[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DBDiagram extends Pick<BaseModels.Diagram, '_id' | 'type' | 'name' | 'variables' | 'children' | 'intentStepIDs'> {}
