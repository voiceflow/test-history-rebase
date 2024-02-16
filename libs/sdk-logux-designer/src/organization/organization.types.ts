export interface BaseOrganizationPayload {
  organizationID: string;
}

export interface OrganizationActionContext {
  organizationID: string;
  subscriptionID?: string | null;
}

export interface OrganizationAction {
  context: OrganizationActionContext;
}
