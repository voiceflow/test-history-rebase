import { Identity, OrganizationMember } from '@realtime-sdk/models';
import { getRoleStrength } from '@realtime-sdk/utils/role';
import { createSimpleAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import uniqBy from 'lodash/uniqBy';

const organizationMemberSimpleAdapter = createSimpleAdapter<Identity.OrganizationMember, OrganizationMember>(
  ({ user, membership }) => ({ name: user.name, role: membership.role, email: user.email, image: user.image, creatorID: user.id }),
  notImplementedAdapter.transformer
);

const organizationMemberAdapter = {
  ...organizationMemberSimpleAdapter,

  mapFromDB: (members: Identity.OrganizationMember[]): OrganizationMember[] =>
    uniqBy(
      members.map(organizationMemberSimpleAdapter.fromDB).sort((a, b) => getRoleStrength(b.role) - getRoleStrength(a.role)),
      (member) => member.creatorID
    ),

  mapToDB: notImplementedAdapter.multi.mapToDB,
};

export default organizationMemberAdapter;
