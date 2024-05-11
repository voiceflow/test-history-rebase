import { PostgresMutableORM } from '@/postgres/common/orms/postgres-mutable.orm';

import { IntegrationOauthTokenEntity } from './integration-oauth-token.entity';
import { IntegrationOauthTokenJSONAdapter } from './integration-oauth-token-json.adapter';

export class IntegrationOauthTokenORM extends PostgresMutableORM<IntegrationOauthTokenEntity> {
  Entity = IntegrationOauthTokenEntity;

  jsonAdapter = IntegrationOauthTokenJSONAdapter;

  findManyByAssistant(assistantID: string) {
    return this.find({ scope: 'assistant', resourceID: assistantID });
  }

  findOneByType(assistantID: string, type: string) {
    return this.find({ scope: 'assistant', resourceID: assistantID, type });
  }
}
