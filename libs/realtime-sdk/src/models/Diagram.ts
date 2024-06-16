import { BaseModels } from '@voiceflow/base-types';

export interface Diagram {
  id: string;
  diagramID: string;
  type: BaseModels.Diagram.DiagramType;
  name: string;
  zoom: number;
  offsetX: number;
  offsetY: number;
  variables: string[];
}

export interface DBDiagram
  extends Pick<
    BaseModels.Diagram.Model,
    '_id' | 'name' | 'variables' | 'children' | 'zoom' | 'offsetX' | 'offsetY' | 'menuNodeIDs' | 'diagramID'
  > {
  type?: string;
}
