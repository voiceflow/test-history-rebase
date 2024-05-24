import { Organization, OrganizationMember } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

export const organizationMemberAdapter = createMultiAdapter<Realtime.Identity.OrganizationMember, OrganizationMember>(
  ({ user, membership }) => ({
    name: user.name,
    role: membership.role,
    email: user.email,
    image: user.image,
    creatorID: user.id,
    scope: membership.scope,
    organizationID: membership.organizationID,
    workspaceID: membership.workspaceID,
    assistantID: membership.projectID,
  }),
  notImplementedAdapter.transformer
);

export const organizationAdapter = createMultiAdapter<Realtime.Identity.Organization, Organization>(
  ({ id, name, image, members = [], trial = null, createdAt, updatedAt }) => {
    return {
      id,
      name,
      image,
      trial: trial ? { daysLeft: trial.daysLeft, endAt: trial.endAt } : null,
      members: organizationMemberAdapter.mapFromDB(members),
      createdAt,
      updatedAt,
    };
  },
  notImplementedAdapter.transformer
);
