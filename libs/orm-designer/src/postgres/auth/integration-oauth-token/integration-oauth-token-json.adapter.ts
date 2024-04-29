import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { IntegrationOauthTokenJSON, IntegrationOauthTokenObject } from './integration-oauth-token.interface';

export const IntegrationOauthTokenJSONAdapter = createSmartMultiAdapter<
  IntegrationOauthTokenObject,
  IntegrationOauthTokenJSON
>(
  ({ createdAt, ...data }) => ({
    ...data,

    ...(createdAt !== undefined && { createdAt: createdAt.toJSON() }),
  }),
  ({ createdAt, ...data }) => ({
    ...data,

    ...(createdAt !== undefined && { createdAt: new Date(createdAt) }),
  })
);
