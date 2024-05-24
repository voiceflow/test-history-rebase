import { z } from 'zod';

import { SubscriptionDTO } from '@/billing/subscription.dto';

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

export type Organization = z.infer<typeof OrganizationDTO>;
