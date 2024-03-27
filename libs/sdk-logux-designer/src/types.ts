import type { Diagram } from '@voiceflow/dtos';

export interface DesignerActionContext {
  assistantID: string;
  environmentID: string;
  broadcastOnly?: boolean;
}

export interface DesignerAction {
  context: DesignerActionContext;
}

export interface ActiveFlowActionContext extends DesignerActionContext {
  flowID: string;
}

export interface ActiveFlowAction {
  context: ActiveFlowActionContext;
}

export interface LegacyVersionActionContext {
  projectID: string;
  versionID: string;
  workspaceID: string;
  broadcastOnly?: boolean;
}

export interface LegacyVersionAction {
  context: LegacyVersionActionContext;
}

export type WithoutMeta<T> = Omit<T, 'updatedAt' | 'updatedByID' | 'assistantID' | 'environmentID'>;

export type DiagramCreateData = Omit<
  Diagram,
  '_id' | 'creatorID' | 'versionID' | 'intentStepIDs' | 'menuNodeIDs' | 'children' | 'diagramID'
>;
