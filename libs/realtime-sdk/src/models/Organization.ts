import type { SubscriptionDTO } from '@voiceflow/dtos';
import { UserRole } from '@voiceflow/internal';
import { Normalized } from 'normal-store';

export interface OrganizationMember {
  name: string;
  role: UserRole;
  email: string;
  image: string | null;
  creatorID: number;
}

export interface Organization {
  id: string;
  name: string;
  image: string;
  members: Normalized<OrganizationMember>;
  trial: { daysLeft: number; endAt: string } | null;
  chargebeeSubscriptionID: string | null;
  subscription?: SubscriptionDTO | null;
}
