import { Identity, Organization } from '@realtime-sdk/models';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import * as Normal from 'normal-store';

import subscriptionAdapter from '../billing/subscription';
import organizationMemberAdapter from './organizationMember';

const organizationAdapter = createMultiAdapter<Identity.Organization, Organization>(
  ({ id, name, image, members = [], trial = null, createdAt, updatedAt, chargebeeSubscriptionID, subscription }) => {
    return {
      id,
      name,
      image,
      trial: trial ? { daysLeft: trial.daysLeft, endAt: trial.endAt } : null,
      members: Normal.normalize(organizationMemberAdapter.mapFromDB(members), (member) => String(member.creatorID)),
      subscription: subscription ? subscriptionAdapter.fromDB(subscription) : null,
      chargebeeSubscriptionID,
      createdAt,
      updatedAt,
    };
  },
  notImplementedAdapter.transformer
);

export default organizationAdapter;
