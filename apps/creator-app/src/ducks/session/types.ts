export interface SessionState {
  token: { value: string | null };
  activeProjectID: string | null;
  activeVersionID: string | null;
  activeDiagramID: string | null;
  activeWorkspaceID: string | null;
  prototypeSidebarVisible: boolean;
}
