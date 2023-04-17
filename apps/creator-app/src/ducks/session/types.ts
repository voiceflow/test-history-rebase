export interface SessionState {
  token: { value: string | null };
  tabID: string;
  browserID: string;
  activeWorkspaceID: string | null;
  activeDomainID: string | null;
  activeProjectID: string | null;
  activeVersionID: string | null;
  activeDiagramID: string | null;
  prototypeSidebarVisible: boolean;
}
