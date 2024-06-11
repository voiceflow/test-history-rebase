export interface SessionState {
  token: { value: string | null };
  tabID: string;
  browserID: string;
  activeWorkspaceID: string | null;
  activeProjectID: string | null;
  activeVersionID: string | null;
  activeDiagramID: string | null;
  activeOrganizationID: string | null;
  prototypeSidebarVisible: boolean;
}
