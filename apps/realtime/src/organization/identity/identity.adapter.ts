import { Organization, OrganizationMember } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import * as Identity from '@voiceflow/sdk-identity';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import uniqBy from 'lodash/uniqBy.js';

type LegacyOrganizationMember = Exclude<Identity.Organization['members'], undefined>[number];

export const legacyOrganizationMemberAdapter = createMultiAdapter<LegacyOrganizationMember, OrganizationMember>(
  ({ membership, user }) => ({
    name: user.name,
    email: user.email,
    image: user.image,
    creatorID: user.id,
    role: membership.role,
    scope: 'organization',
    organizationID: membership.organizationID,
    workspaceID: null,
    assistantID: null,
    createdAt: user.createdAt,
  }),
  notImplementedAdapter.transformer
);

export const organizationMemberAdapter = createMultiAdapter<Identity.OrganizationMember, OrganizationMember>(
  ({ user, membership }) => ({
    name: user.name,
    email: user.email,
    image: user.image,
    creatorID: user.id,
    role: membership.role,
    scope: membership.scope,
    organizationID: membership.organizationID,
    workspaceID: membership.workspaceID,
    assistantID: membership.assistantID,
    createdAt: user.createdAt,
  }),
  notImplementedAdapter.transformer
);

const getUniqueSortedByRoleStrengthMembers = (members: LegacyOrganizationMember[]): LegacyOrganizationMember[] =>
  uniqBy(
    members.sort(
      (a, b) =>
        Realtime.Utils.role.getRoleStrength(a.membership.role) - Realtime.Utils.role.getRoleStrength(b.membership.role)
    ),
    (member) => member.user.id
  );

export const organizationAdapter = createMultiAdapter<Identity.Organization, Organization>(
  ({ id, name, image, members = [], trial = null }) => {
    return {
      id,
      name,
      image,
      trial,
      members: legacyOrganizationMemberAdapter.mapFromDB(getUniqueSortedByRoleStrengthMembers(members)),
    };
  },
  notImplementedAdapter.transformer
);
