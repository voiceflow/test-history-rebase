import { OrganizationMember } from './OrganizationMember';

export interface Organization {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  image: string;
  members?: OrganizationMember[];
  trial: { daysLeft: number; endAt: string } | null;
  chargebeeSubscriptionID: string | null;
}
