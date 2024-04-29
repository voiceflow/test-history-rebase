import type { ToJSON, ToObject } from '@/types';

import type { IntegrationOauthTokenEntity } from './integration-oauth-token.entity';

export type IntegrationOauthTokenObject = ToObject<IntegrationOauthTokenEntity>;
export type IntegrationOauthTokenJSON = ToJSON<IntegrationOauthTokenObject>;
