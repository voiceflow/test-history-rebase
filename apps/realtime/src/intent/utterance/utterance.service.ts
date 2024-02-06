import type { EntityManager } from '@mikro-orm/core';
import { Primary } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import { AssistantEntity, DatabaseTarget, IntentEntity, PKOrEntity, UtteranceEntity, UtteranceORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSObjectService, EntitySerializer } from '@/common';
import type { CreateManyForUserData } from '@/common/types';
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';

@Injectable()
export class UtteranceService extends CMSObjectService<UtteranceORM> {
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(UtteranceORM)
    protected readonly orm: UtteranceORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(EntitySerializer)
    protected readonly entitySerializer: EntitySerializer
  ) {
    super();
  }

  /* Find */

  findManyByIntents(intents: PKOrEntity<IntentEntity>[]) {
    return this.orm.findManyByIntents(intents);
  }

  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findManyByEnvironment(assistant, environmentID);
  }

  findManyJSONByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findAllJSON({ assistant, environmentID });
  }
  /* Create */

  async createManyAndSync(userID: number, data: CreateManyForUserData<UtteranceORM>) {
    return this.postgresEM.transactional(async () => {
      const utterances = await this.createManyForUser(userID, data);

      return {
        add: { utterances },
      };
    });
  }

  async broadcastAddMany(authMeta: AuthMetaPayload, { add }: { add: { utterances: UtteranceEntity[] } }) {
    await Promise.all(
      groupByAssistant(add.utterances).map((utterances) =>
        this.logux.processAs(
          Actions.Utterance.AddMany({
            data: this.entitySerializer.iterable(utterances),
            context: assistantBroadcastContext(utterances[0]),
          }),
          authMeta
        )
      )
    );
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: CreateManyForUserData<UtteranceORM>) {
    const result = await this.createManyAndSync(authMeta.userID, data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.utterances;
  }

  /* Delete */

  async broadcastDeleteMany(authMeta: AuthMetaPayload, { delete: del }: { delete: { utterances: UtteranceEntity[] } }) {
    await Promise.all(
      groupByAssistant(del.utterances).map((utterances) =>
        this.logux.processAs(
          Actions.Utterance.DeleteMany({
            ids: toEntityIDs(utterances),
            context: assistantBroadcastContext(utterances[0]),
          }),
          authMeta
        )
      )
    );
  }

  async deleteManyAndSync(ids: Primary<UtteranceEntity>[]) {
    return this.postgresEM.transactional(async () => {
      const utterances = await this.findMany(ids);

      await this.deleteMany(utterances);

      return {
        delete: { utterances },
      };
    });
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<UtteranceEntity>[]) {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }
}
