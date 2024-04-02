export interface BaseOrganizationPayload {
  organizationID: string;
}

export interface OrganizationActionContext {
  organizationID: string;
}

export interface OrganizationAction {
  context: OrganizationActionContext;
}

export interface OrganizationSubscriptionAction {
  context: OrganizationActionContext;
}
