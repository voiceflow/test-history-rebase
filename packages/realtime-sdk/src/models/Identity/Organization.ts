import { OrganizationMember } from './OrganizationMember';

export interface Organization {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  name: string;
  image: string;
  members?: OrganizationMember[];
}
