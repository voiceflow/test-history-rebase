import type { Organization, OrganizationMember } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { createMultiAdapter, createSimpleAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import _uniqBy from 'lodash/uniqBy.js';

export const organizationMemberSimpleAdapter = createSimpleAdapter<
  Realtime.Identity.OrganizationMember,
  OrganizationMember
>(
  ({ user, membership }) => ({
    name: user.name,
    role: membership.role,
    email: user.email,
    image: user.image,
    creatorID: user.id,
  }),
  notImplementedAdapter.transformer
);

// TODO [organization refactor] refactor adapter
export const organizationMemberAdapter = {
  ...organizationMemberSimpleAdapter,

  mapFromDB: (members: Realtime.Identity.OrganizationMember[]): OrganizationMember[] =>
    _uniqBy(
      members
        .map(organizationMemberSimpleAdapter.fromDB)
        .sort((a, b) => Realtime.Utils.role.getRoleStrength(b.role) - Realtime.Utils.role.getRoleStrength(a.role)),
      (member) => member.creatorID
    ),

  mapToDB: notImplementedAdapter.multi.mapToDB,
};

// TODO [organization refactor] refactor adapter
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
