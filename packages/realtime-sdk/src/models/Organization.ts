export interface Organization {
  id: string;
  name: string;
}

export interface IdentityOrganization {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  name: string;
}
