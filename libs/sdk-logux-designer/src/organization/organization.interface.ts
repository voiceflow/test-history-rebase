import type { Normalized } from 'normal-store';

import type { BaseResource } from '@/common';

import type { OrganizationMember } from './organization-member/organization-member.interface';

export interface OrganizationTrial {
  endAt: string;
  daysLeft: number;
}

export interface Organization extends BaseResource {
  name: string;
  image: string;
  trial: OrganizationTrial | null;
  members: Normalized<OrganizationMember>;
}
