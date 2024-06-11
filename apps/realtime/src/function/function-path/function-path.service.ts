import type { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { NotFoundException } from '@voiceflow/exception';
import { LoguxService } from '@voiceflow/nestjs-logux';
import {
  AssistantORM,
  DatabaseTarget,
  FunctionObject,
  FunctionORM,
  FunctionPathObject,
  FunctionPathORM,
} from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSObjectService } from '@/common';
import type { CMSCreateForUserData } from '@/common/types';
import { cmsBroadcastContext, injectAssistantAndEnvironmentIDs, toPostgresEntityIDs } from '@/common/utils';
import { CMSBroadcastMeta, CMSContext } from '@/types';

@Injectable()
export class FunctionPathService extends CMSObjectService<FunctionPathORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(FunctionPathORM)
    protected readonly orm: FunctionPathORM,
    @Inject(FunctionORM)
    protected readonly functionOrm: FunctionORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM
  ) {
    super();
  }

  findManyByFunctions(environmentID: string, functionIDs: string[]) {
    return this.orm.findManyByFunctions(environmentID, functionIDs);
  }

  findManyByEnvironment(environmentID: string) {
    return this.orm.findManyByEnvironment(environmentID);
  }

  findManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.findManyByEnvironmentAndIDs(environmentID, ids);
  }

  /* Helpers */

  async syncFunctionPaths(
    funcPaths: FunctionPathObject[],
    { action, userID, context }: { action: 'create' | 'delete'; userID: number; context: CMSContext }
  ) {
    const functionIds = Utils.array.unique(funcPaths.map((path) => path.functionID));
    const functions = await this.functionOrm.findManyByEnvironmentAndIDs(context.environmentID, functionIds);

    if (functionIds.length !== functions.length) {
      throw new NotFoundException('Failed to find functions in db');
    }

    const funcPathsByFunctionId = funcPaths.reduce<Record<string, FunctionPathObject[]>>((acc, funcPath) => {
      acc[funcPath.functionID] ??= [];
      acc[funcPath.functionID].push(funcPath);

      return acc;
    }, {});

    await Promise.all(
      functions.map(async (func) => {
        const funcPathIds = funcPathsByFunctionId[func.id].map((path) => path.id);
        let pathOrder: string[];

        if (action === 'create') {
          pathOrder = Utils.array.unique([...func.pathOrder, ...funcPathIds]);
        } else {
          pathOrder = func.pathOrder.filter((pathId) => !funcPathIds.includes(pathId));
        }

        // eslint-disable-next-line no-param-reassign
        func.pathOrder = pathOrder;

        await this.functionOrm.patchOneForUser(
          userID,
          { id: func.id, environmentID: context.environmentID },
          { pathOrder }
        );
      })
    );

    return functions;
  }

  /* Create */

  async createManyAndSync(
    data: CMSCreateForUserData<FunctionPathORM>[],
    { userID, meta }: { userID: number; meta: CMSBroadcastMeta }
  ) {
    return this.postgresEM.transactional(async () => {
      const functionPaths = await this.createManyForUser(
        userID,
        data.map(injectAssistantAndEnvironmentIDs(meta.context))
      );
      const functions = await this.syncFunctionPaths(functionPaths, {
        action: 'create',
        userID,
        context: meta.context,
      });

      return {
        add: { functionPaths },
        sync: { functions },
      };
    });
  }

  async broadcastAddMany(
    {
      add,
      sync,
    }: {
      add: { functionPaths: FunctionPathObject[] };
      sync: { functions: FunctionObject[] };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.logux.processAs(
        Actions.FunctionPath.AddMany({
          data: this.mapToJSON(add.functionPaths),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),

      ...sync.functions.map((func) =>
        this.logux.processAs(
          Actions.Function.PatchOne({
            id: func.id,
            patch: { pathOrder: func.pathOrder },
            context: cmsBroadcastContext(meta.context),
          }),
          meta.auth
        )
      ),
    ]);
  }

  async createManyAndBroadcast(data: CMSCreateForUserData<FunctionPathORM>[], meta: CMSBroadcastMeta) {
    const result = await this.createManyAndSync(data, { userID: meta.auth.userID, meta });

    await this.broadcastAddMany(result, meta);

    return result.add.functionPaths;
  }

  /* Delete */

  deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.deleteManyByEnvironmentAndIDs(environmentID, ids);
  }

  async broadcastDeleteMany(
    {
      delete: del,
      sync,
    }: {
      delete: { functionPaths: FunctionPathObject[] };
      sync: { functions: FunctionObject[] };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      await this.logux.processAs(
        Actions.FunctionPath.DeleteMany({
          ids: toPostgresEntityIDs(del.functionPaths),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),

      ...sync.functions.map((func) =>
        this.logux.processAs(
          Actions.Function.PatchOne({
            id: func.id,
            patch: { pathOrder: func.pathOrder },
            context: cmsBroadcastContext(meta.context),
          }),
          meta.auth
        )
      ),
    ]);
  }

  async deleteManyAndSync(ids: string[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const functionPaths = await this.findManyByEnvironmentAndIDs(context.environmentID, ids);

      await this.deleteManyByEnvironmentAndIDs(context.environmentID, ids);
      const syncedFunctions = await this.syncFunctionPaths(functionPaths, { action: 'delete', userID, context });

      return {
        delete: { functionPaths },
        sync: { functions: syncedFunctions },
      };
    });
  }

  async deleteManyAndBroadcast(ids: string[], meta: CMSBroadcastMeta) {
    const result = await this.deleteManyAndSync(ids, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastDeleteMany(result, meta);
  }
}
