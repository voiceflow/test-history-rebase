import { PostgresMutableORM } from '@/postgres/common/orms/postgres-mutable.orm';

import { IntegrationOauthTokenEntity } from './integration-oauth-token.entity';
import { IntegrationOauthTokenJSONAdapter } from './integration-oauth-token-json.adapter';

export class IntegrationOauthTokenORM extends PostgresMutableORM<IntegrationOauthTokenEntity> {
  Entity = IntegrationOauthTokenEntity;

  jsonAdapter = IntegrationOauthTokenJSONAdapter;

  async upsertByAssistant(assistantID: string, type: string, accessToken: string, creatorID: number, subdomain: string) {
    const result = await this.find({ scope: 'assistant', resourceID: assistantID, type });

    if (result.length !== 0) {
      await this.patch(
        {
          type,
          scope: 'assistant',
          resourceID: assistantID,
        },
        {
          accessToken,
          creatorID,
          subdomain,
          state: 'active',
          createdAt: new Date(),
        }
      );
    } else {
      await this.createOne({
        type,
        scope: 'assistant',
        resourceID: assistantID,
        accessToken,
        creatorID,
        subdomain,
        state: 'active',
        createdAt: new Date(),
      });
    }
  }

  findManyByAssistant(assistantID: string) {
    return this.find({ scope: 'assistant', resourceID: assistantID });
  }

  findOneByType(assistantID: string, type: string) {
    return this.find({ scope: 'assistant', resourceID: assistantID, type });
  }

  deleteOneByType(assistantID: string, type: string) {
    return this.delete({ scope: 'assistant', resourceID: assistantID, type });
  }
}
