import { BaseModels } from '@voiceflow/base-types';

export interface Diagram {
  id: string;
  diagramID: string;
  type: BaseModels.Diagram.DiagramType;
  name: string;
  zoom: number;
  offsetX: number;
  offsetY: number;
  /**
   * @deprecated will be removed when FeatureFlag.CMS_WORKFLOWS is released
   */
  menuItems: BaseModels.Diagram.MenuItem[];
  variables: string[];

  /**
   * @deprecated will be removed when FeatureFlag.CMS_WORKFLOWS is released
   */
  menuNodeIDs?: string[];
}

export interface DBDiagram
  extends Pick<BaseModels.Diagram.Model, '_id' | 'name' | 'variables' | 'children' | 'zoom' | 'offsetX' | 'offsetY' | 'menuNodeIDs' | 'diagramID'> {
  type?: string;

  /**
   * @deprecated will be removed when FeatureFlag.CMS_WORKFLOWS is released
   */
  menuItems?: { type: string; sourceID: string }[];
}
