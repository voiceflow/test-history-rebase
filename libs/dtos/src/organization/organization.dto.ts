import { z } from 'zod';

import { SubscriptionDTO } from '@/billing/subscription.dto';

import type { OrganizationMember } from './organization-member.dto';
import { OrganizationMemberDTO } from './organization-member.dto';

export const OrganizationDTO = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  members: z.array(OrganizationMemberDTO),
  trial: z
    .object({
      daysLeft: z.number(),
      endAt: z.string(),
    })
    .nullable(),
  subscription: SubscriptionDTO.optional().nullable(),
});

export interface Organization extends Omit<z.infer<typeof OrganizationDTO>, 'members'> {
  members: OrganizationMember[];
}
