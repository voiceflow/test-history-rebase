import type { BaseModels } from '@voiceflow/base-types';

export interface Diagram {
  id: string;
  diagramID: string;
  type: BaseModels.Diagram.DiagramType;
  name: string;
  zoom: number;
  offsetX: number;
  offsetY: number;
  menuItems: BaseModels.Diagram.MenuItem[];
  variables: string[];

  /**
   * @deprecated use `menuItems` instead, remove when not used, check in the datadog realtime version
   */
  menuNodeIDs?: string[];
}

export interface DBDiagram
  extends Pick<
    BaseModels.Diagram.Model,
    '_id' | 'name' | 'variables' | 'children' | 'zoom' | 'offsetX' | 'offsetY' | 'menuNodeIDs' | 'diagramID'
  > {
  type?: string;

  menuItems?: { type: string; sourceID: string }[];
}
