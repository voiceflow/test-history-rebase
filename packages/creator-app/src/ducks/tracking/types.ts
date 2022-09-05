// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TrackingState {}

export interface WorkspaceEventInfo {
  workspaceID: string;
}

export interface ProjectEventInfo extends WorkspaceEventInfo {
  projectID: string;
}

export interface VersionEventInfo extends ProjectEventInfo {
  skillID: string;
}

export interface ProjectSessionEventInfo extends VersionEventInfo {
  creatorID: number;
}
