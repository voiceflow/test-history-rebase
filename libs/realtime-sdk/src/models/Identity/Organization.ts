import { LegacyOrganizationMember } from './LegacyOrganizationMember';

export interface Organization {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  image: string;
  members?: LegacyOrganizationMember[];
  trial: { daysLeft: number; endAt: string } | null;
}
