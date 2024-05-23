import { OrganizationMember } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

export const organizationMemberAdapter = createMultiAdapter<Realtime.Identity.OrganizationMember, OrganizationMember>(
  ({ user, membership }) => {
    return {
      ...user,
      ...membership,
      creatorID: user.id,
    };
  },
  notImplementedAdapter.transformer
);
