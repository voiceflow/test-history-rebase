import { PostgresMutableORM } from '@/postgres/common/orms/postgres-mutable.orm';

import { IntegrationOauthTokenEntity } from './integration-oauth-token.entity';
import { IntegrationOauthTokenJSONAdapter } from './integration-oauth-token-json.adapter';

export class IntegrationOauthTokenORM extends PostgresMutableORM<IntegrationOauthTokenEntity> {
  Entity = IntegrationOauthTokenEntity;

  jsonAdapter = IntegrationOauthTokenJSONAdapter;
}
