import { z } from 'zod';

import { IntegrationTokenScope } from './integration-token-scope.enum';
import { IntegrationTokenState } from './integration-token-state.enum';

export const IntegrationOauthTokenDTO = z
  .object({
    id: z.number(),
    type: z.string(),
    meta: z.record(z.unknown()).nullable(),
    scope: z.nativeEnum(IntegrationTokenScope),
    state: z.nativeEnum(IntegrationTokenState),
    creatorID: z.number().nullable(),
    createdAt: z.string().datetime(),
    resourceID: z.string(),
    accessToken: z.string(),
    refreshToken: z.string().nullable(),
  })
  .strict();

export type IntegrationOauthToken = z.infer<typeof IntegrationOauthTokenDTO>;
