import { Organization } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

// TODO [organization refactor] refactor adapter
export const organizationAdapter = createMultiAdapter<Realtime.Identity.Organization, Organization>(
  ({ id, name, image, trial = null, createdAt, updatedAt }) => {
    return {
      id,
      name,
      image,
      trial: trial ? { daysLeft: trial.daysLeft, endAt: trial.endAt } : null,
      members: [],
      createdAt,
      updatedAt,
    };
  },
  notImplementedAdapter.transformer
);
