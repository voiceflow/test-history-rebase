/* eslint-disable max-params */
import type { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import type {
  AnyResponseAttachmentObject,
  AnyResponseVariantObject,
  ResponseDiscriminatorObject,
} from '@voiceflow/orm-designer';
import { AssistantORM, DatabaseTarget, ResponseDiscriminatorORM, ResponseORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSObjectService } from '@/common';
import type { CMSCreateForUserData } from '@/common/types';
import { cmsBroadcastContext, injectAssistantAndEnvironmentIDs, toPostgresEntityIDs } from '@/common/utils';
import { CMSBroadcastMeta, CMSContext } from '@/types';

import { ResponseVariantService } from '../response-variant/response-variant.service';

@Injectable()
export class ResponseDiscriminatorService extends CMSObjectService<ResponseDiscriminatorORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(ResponseDiscriminatorORM)
    protected readonly orm: ResponseDiscriminatorORM,
    @Inject(ResponseORM)
    protected readonly responseORM: ResponseORM,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(ResponseVariantService)
    protected readonly responseVariant: ResponseVariantService
  ) {
    super();
  }

  /* Find */

  findManyByResponses(environmentID: string, responseIDs: string[]) {
    return this.orm.findManyByResponses(environmentID, responseIDs);
  }

  findManyByEnvironment(environmentID: string) {
    return this.orm.findManyByEnvironment(environmentID);
  }

  findManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.findManyByEnvironmentAndIDs(environmentID, ids);
  }

  /* Create */

  async createManyAndSync(
    data: CMSCreateForUserData<ResponseDiscriminatorORM>[],
    { userID, context }: { userID: number; context: CMSContext }
  ) {
    return this.postgresEM.transactional(async () => {
      const responseDiscriminators = await this.createManyForUser(
        userID,
        data.map(injectAssistantAndEnvironmentIDs(context))
      );

      return {
        add: {
          prompts: [],
          responseVariants: [],
          responseAttachments: [],
          responseDiscriminators,
        },
      };
    });
  }

  async broadcastAddMany(
    {
      add,
    }: {
      add: {
        responseVariants: AnyResponseVariantObject[];
        responseAttachments: AnyResponseAttachmentObject[];
        responseDiscriminators: ResponseDiscriminatorObject[];
      };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.responseVariant.broadcastAddMany(
        {
          add: Utils.object.pick(add, ['responseVariants', 'responseAttachments']),
          // no need to sync, cause should be synced on create
          sync: { responseDiscriminators: [] },
        },
        meta
      ),

      this.logux.processAs(
        Actions.ResponseDiscriminator.AddMany({
          data: this.mapToJSON(add.responseDiscriminators),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }

  async createManyAndBroadcast(data: CMSCreateForUserData<ResponseDiscriminatorORM>[], meta: CMSBroadcastMeta) {
    const result = await this.createManyAndSync(data, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastAddMany(result, meta);

    return result.add.responseDiscriminators;
  }

  /* Delete */

  deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.deleteManyByEnvironmentAndIDs(environmentID, ids);
  }

  async collectRelationsToDelete(environmentID: string, ids: string[]) {
    const responseVariants = await this.responseVariant.findManyByDiscriminators(environmentID, ids);
    const relations = await this.responseVariant.collectRelationsToDelete(
      environmentID,
      toPostgresEntityIDs(responseVariants)
    );

    return {
      ...relations,
      responseVariants,
    };
  }

  async deleteManyAndSync(ids: string[], context: CMSContext) {
    return this.postgresEM.transactional(async () => {
      const [responseDiscriminators, relations] = await Promise.all([
        this.findManyByEnvironmentAndIDs(context.environmentID, ids),
        this.collectRelationsToDelete(context.environmentID, ids),
      ]);

      await this.deleteManyByEnvironmentAndIDs(context.environmentID, ids);

      return {
        delete: {
          ...relations,
          responseDiscriminators,
        },
      };
    });
  }

  async broadcastDeleteMany(
    {
      delete: del,
    }: {
      delete: {
        responseVariants: AnyResponseVariantObject[];
        responseAttachments: AnyResponseAttachmentObject[];
        responseDiscriminators: ResponseDiscriminatorObject[];
      };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.logux.processAs(
        Actions.ResponseDiscriminator.DeleteMany({
          ids: toPostgresEntityIDs(del.responseDiscriminators),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),

      this.responseVariant.broadcastDeleteMany(
        {
          // no need to sync discriminators, because they are deleted
          sync: { responseDiscriminators: [] },
          delete: Utils.object.pick(del, ['responseVariants', 'responseAttachments']),
        },
        meta
      ),
    ]);
  }

  async deleteManyAndBroadcast(ids: string[], meta: CMSBroadcastMeta) {
    const result = await this.deleteManyAndSync(ids, meta.context);

    await this.broadcastDeleteMany(result, meta);
  }
}
