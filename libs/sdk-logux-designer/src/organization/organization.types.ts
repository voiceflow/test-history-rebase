export interface BaseOrganizationPayload {
  organizationID: string;
}

export interface OrganizationActionContext {
  organizationID: string;
  workspaceID: string;
}

export interface OrganizationAction {
  context: OrganizationActionContext;
}

export interface BaseOrganizationSubscriptionAction {
  context: OrganizationActionContext;
}
