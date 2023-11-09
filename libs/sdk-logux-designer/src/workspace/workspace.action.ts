export interface WorkspaceActionContext {
  workspaceID: string;
}

export interface WorkspaceAction {
  context: WorkspaceActionContext;
}
