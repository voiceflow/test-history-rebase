import type { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import { DatabaseTarget, UtteranceObject, UtteranceORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSObjectService } from '@/common';
import type { CMSCreateForUserData } from '@/common/types';
import { cmsBroadcastContext, injectAssistantAndEnvironmentIDs, toPostgresEntityIDs } from '@/common/utils';
import { CMSBroadcastMeta, CMSContext } from '@/types';

@Injectable()
export class UtteranceService extends CMSObjectService<UtteranceORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(UtteranceORM)
    protected readonly orm: UtteranceORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService
  ) {
    super();
  }

  /* Find */

  findManyByIntents(environmentID: string, intentIDs: string[]) {
    return this.orm.findManyByIntents(environmentID, intentIDs);
  }

  findManyByEnvironment(environmentID: string) {
    return this.orm.findManyByEnvironment(environmentID);
  }

  findManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.findManyByEnvironmentAndIDs(environmentID, ids);
  }
  /* Create */

  async createManyAndSync(
    data: CMSCreateForUserData<UtteranceORM>[],
    { userID, context }: { userID: number; context: CMSContext }
  ) {
    const utterances = await this.createManyForUser(userID, data.map(injectAssistantAndEnvironmentIDs(context)));

    return {
      add: { utterances },
    };
  }

  async broadcastAddMany({ add }: { add: { utterances: UtteranceObject[] } }, meta: CMSBroadcastMeta) {
    await this.logux.processAs(
      Actions.Utterance.AddMany({
        data: this.mapToJSON(add.utterances),
        context: cmsBroadcastContext(meta.context),
      }),
      meta.auth
    );
  }

  async createManyAndBroadcast(data: CMSCreateForUserData<UtteranceORM>[], meta: CMSBroadcastMeta) {
    const result = await this.createManyAndSync(data, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastAddMany(result, meta);

    return result.add.utterances;
  }

  /* Delete */

  deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.deleteManyByEnvironmentAndIDs(environmentID, ids);
  }

  async deleteManyAndSync(ids: string[], context: CMSContext) {
    return this.postgresEM.transactional(async () => {
      const utterances = await this.findManyByEnvironmentAndIDs(context.environmentID, ids);

      await this.deleteManyByEnvironmentAndIDs(context.environmentID, ids);

      return {
        delete: { utterances },
      };
    });
  }

  async broadcastDeleteMany({ delete: del }: { delete: { utterances: UtteranceObject[] } }, meta: CMSBroadcastMeta) {
    await this.logux.processAs(
      Actions.Utterance.DeleteMany({
        ids: toPostgresEntityIDs(del.utterances),
        context: cmsBroadcastContext(meta.context),
      }),
      meta.auth
    );
  }

  async deleteManyAndBroadcast(ids: string[], meta: CMSBroadcastMeta) {
    const result = await this.deleteManyAndSync(ids, meta.context);

    await this.broadcastDeleteMany(result, meta);
  }
}
