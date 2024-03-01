export interface BaseOrganizationPayload {
  organizationID: string;
}

export interface OrganizationActionContext {
  organizationID: string;
  subscriptionID?: string | null;
}

export interface OrganizationSubscriptionActionContext {
  organizationID: string;
  subscriptionID: string;
}

export interface OrganizationAction {
  context: OrganizationActionContext;
}

export interface OrganizationSubscriptionAction {
  context: OrganizationActionContext;
}
