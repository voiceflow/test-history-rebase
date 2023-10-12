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
