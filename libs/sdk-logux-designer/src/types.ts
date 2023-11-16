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
