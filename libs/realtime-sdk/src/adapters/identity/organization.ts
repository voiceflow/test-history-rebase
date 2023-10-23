import { Identity, Organization } from '@realtime-sdk/models';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import * as Normal from 'normal-store';

import organizationMemberAdapter from './organizationMember';

const organizationAdapter = createMultiAdapter<Identity.Organization, Organization>(
  ({ id, name, image, members = [], trial = null, createdAt, updatedAt }) => ({
    id,
    name,
    image,
    trial: trial ? { daysLeft: trial.daysLeft, endAt: trial.endAt } : null,
    members: Normal.normalize(organizationMemberAdapter.mapFromDB(members), (member) => String(member.creatorID)),
    createdAt,
    updatedAt,
  }),
  notImplementedAdapter.transformer
);

export default organizationAdapter;
