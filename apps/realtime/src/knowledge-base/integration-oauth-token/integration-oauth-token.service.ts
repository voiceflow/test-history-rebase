import { Inject, Injectable } from '@nestjs/common';
import { KnowledgeBaseDocumentIntegrationType } from '@voiceflow/dtos';
import { IntegrationOauthTokenORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';
import { TokenEncryptionService } from '@/knowledge-base/integration-oauth-token/token-encryption.service';

import { IntegrationFindManyResponse } from './dtos/integration-find.dto';

@Injectable()
export class IntegrationOauthTokenService extends MutableService<IntegrationOauthTokenORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(IntegrationOauthTokenORM)
    protected readonly orm: IntegrationOauthTokenORM,
    @Inject(TokenEncryptionService)
    protected readonly tokenEncryption: TokenEncryptionService
  ) {
    super();
  }

  async getIntegrationTokensMapping(integrationTokenIDSet: Set<number>): Promise<Record<number, string>> {
    const integrationTokensArray = await this.orm.find({ id: [...integrationTokenIDSet] });

    return integrationTokensArray.reduce((acc, obj) => {
      const { id, accessToken } = obj;
      acc[id] = this.tokenEncryption.decrypt(accessToken.toString());
      return acc;
    }, {} as Record<number, string>);
  }

  async getManyIntegrationTokens(assistantID: string): Promise<IntegrationFindManyResponse> {
    const integrations = await this.orm.findManyByAssistant(assistantID);
    return {
      data: integrations.map(({ type, state, creatorID, createdAt }: { type: string; state: string; creatorID: number | null; createdAt: Date }) => ({
        type: type as KnowledgeBaseDocumentIntegrationType,
        state,
        creatorID,
        createdAt: createdAt?.toISOString(),
      })),
    };
  }
}
