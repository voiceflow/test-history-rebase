// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TrackingState {}

export interface WorkspaceEventInfo {
  workspaceID: string;
}

export interface ProjectEventInfo {
  skillID: string;
  projectID: string;
  workspaceID: string;
}

export interface ConversationsEventInfo {
  projectID: string;
  workspaceID: string;
}
