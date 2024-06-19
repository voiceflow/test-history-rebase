export interface WorkspaceActionContext {
  workspaceID: string;
  broadcastOnly?: boolean;
}

export interface WorkspaceAction {
  context: WorkspaceActionContext;
}
