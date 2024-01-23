import { OrganizationMember } from './OrganizationMember';
import { Subscription } from './Subscription';

export interface Organization {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  image: string;
  members?: OrganizationMember[];
  trial: { daysLeft: number; endAt: string } | null;
  chargebeeSubscriptionID: string | null;
  subscription?: Subscription | null;
}
