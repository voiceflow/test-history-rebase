import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type { AssistantEntity, IntentEntity, PKOrEntity, UtteranceEntity } from '@voiceflow/orm-designer';
import { UtteranceORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { EntitySerializer, MutableService } from '@/common';
import type { CreateManyData } from '@/common/types';
import { broadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';

@Injectable()
export class UtteranceService extends MutableService<UtteranceORM> {
  constructor(
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

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findManyByAssistant(assistant, environmentID);
  }

  /* Create */

  async createManyAndSync(data: CreateManyData<UtteranceORM>) {
    const utterances = await this.createMany(data);

    return {
      add: { utterances },
    };
  }

  async broadcastAddMany(authMeta: AuthMetaPayload, { add }: { add: { utterances: UtteranceEntity[] } }) {
    await Promise.all(
      groupByAssistant(add.utterances).map((utterances) =>
        this.logux.processAs(
          Actions.Utterance.AddMany({
            data: this.entitySerializer.iterable(utterances),
            context: broadcastContext(utterances[0]),
          }),
          authMeta
        )
      )
    );
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: CreateManyData<UtteranceORM>) {
    const result = await this.createManyAndSync(data);

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
            context: broadcastContext(utterances[0]),
          }),
          authMeta
        )
      )
    );
  }

  async deleteManyAndSync(ids: Primary<UtteranceEntity>[]) {
    const utterances = await this.findMany(ids);

    await this.deleteMany(utterances);

    return {
      delete: { utterances },
    };
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<UtteranceEntity>[]) {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }
}
