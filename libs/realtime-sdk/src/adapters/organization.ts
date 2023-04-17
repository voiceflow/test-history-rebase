import { Identity, Organization } from '@realtime-sdk/models';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import * as Normal from 'normal-store';

const organizationAdapter = createMultiAdapter<Identity.Organization, Organization>(
  ({ id, name, image, members = [], createdAt, updatedAt, deletedAt }) => ({
    id,
    name,
    image,
    members: Normal.normalize(
      members.map(({ user, membership }) => ({ name: user.name, role: membership.role, email: user.email, image: user.image, creatorID: user.id })),
      (member) => String(member.creatorID)
    ),
    createdAt,
    updatedAt,
    deletedAt,
  }),
  notImplementedAdapter.transformer
);

export default organizationAdapter;
