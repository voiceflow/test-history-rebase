export interface SessionState {
  token: { value: string | null };
  tabID: string;
  browserID: string;
  activeWorkspaceID: string | null;
  /**
   * @deprecated remove when FeatureFlag.CMS_WORKFLOWS are released
   */
  activeDomainID: string | null;
  activeProjectID: string | null;
  activeVersionID: string | null;
  activeDiagramID: string | null;
  prototypeSidebarVisible: boolean;
}
