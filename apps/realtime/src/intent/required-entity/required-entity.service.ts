/* eslint-disable max-params */

import type { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { NotFoundException } from '@voiceflow/exception';
import { LoguxService } from '@voiceflow/nestjs-logux';
import type {
  AnyResponseAttachmentObject,
  AnyResponseVariantObject,
  CMSCompositePK,
  IntentObject,
  ReferenceObject,
  ReferenceResourceObject,
  RequiredEntityObject,
  ResponseDiscriminatorObject,
  ResponseObject,
} from '@voiceflow/orm-designer';
import { DatabaseTarget, EntityORM, IntentORM, ObjectId, RequiredEntityORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSObjectService } from '@/common';
import { cmsBroadcastContext, toPostgresEntityIDs } from '@/common/utils';
import { ReferenceService } from '@/reference/reference.service';
import { ResponseCreateWithSubResourcesData } from '@/response/response.interface';
import { ResponseService } from '@/response/response.service';
import { CMSBroadcastMeta, CMSContext } from '@/types';

import { RequiredEntityCreateData } from './required-entity.interface';

@Injectable()
export class RequiredEntityService extends CMSObjectService<RequiredEntityORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(RequiredEntityORM)
    protected readonly orm: RequiredEntityORM,
    @Inject(IntentORM)
    protected readonly intentORM: IntentORM,
    @Inject(EntityORM)
    protected readonly entityORM: EntityORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(ResponseService)
    private readonly response: ResponseService,
    @Inject(ReferenceService)
    private readonly reference: ReferenceService
  ) {
    super();
  }

  /* Helpers */

  protected async syncIntents(
    requiredEntities: RequiredEntityObject[],
    { action, userID, context }: { action: 'create' | 'delete'; userID: number; context: CMSContext }
  ) {
    const intentIDs = Utils.array.unique(requiredEntities.map((requiredEntity) => requiredEntity.intentID));

    const intents = await this.intentORM.findManyByEnvironmentAndIDs(context.environmentID, intentIDs);

    if (intentIDs.length !== intents.length) {
      throw new NotFoundException("couldn't find intent to sync");
    }

    const requiredEntitiesByIntentID = requiredEntities.reduce<Record<string, RequiredEntityObject[]>>(
      (acc, entity) => {
        acc[entity.intentID] ??= [];
        acc[entity.intentID].push(entity);

        return acc;
      },
      {}
    );

    await Promise.all(
      intents.map(async (intent) => {
        const entityIDs = toPostgresEntityIDs(requiredEntitiesByIntentID[intent.id] ?? []);

        if (!entityIDs.length) {
          throw new NotFoundException("couldn't find required entities for intent to sync");
        }

        let entityOrder: string[];

        if (action === 'create') {
          entityOrder = Utils.array.unique([...intent.entityOrder, ...entityIDs]);
        } else {
          entityOrder = intent.entityOrder.filter((id) => !entityIDs.includes(id));
        }

        // eslint-disable-next-line no-param-reassign
        intent.entityOrder = entityOrder;

        await this.intentORM.patchOneForUser(
          userID,
          { id: intent.id, environmentID: intent.environmentID },
          { entityOrder }
        );
      })
    );

    return intents;
  }

  async broadcastSync({ sync }: { sync: { intents: IntentObject[] } }, meta: CMSBroadcastMeta) {
    await Promise.all(
      sync.intents.map((intent) =>
        this.logux.processAs(
          Actions.Intent.PatchOne({
            id: intent.id,
            patch: { entityOrder: intent.entityOrder },
            context: cmsBroadcastContext(meta.context),
          }),
          meta.auth
        )
      )
    );
  }

  /* Find */

  findManyByIntents(environmentID: string, intentIDs: string[]) {
    return this.orm.findManyByIntents(environmentID, intentIDs);
  }

  findManyByEntities(environmentID: string, entityIDs: string[]) {
    return this.orm.findManyByEntities(environmentID, entityIDs);
  }

  findManyByEnvironment(environmentID: string) {
    return this.orm.findManyByEnvironment(environmentID);
  }

  findManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.findManyByEnvironmentAndIDs(environmentID, ids);
  }

  /* Create */

  async createManyWithSubResources(
    requiredEntitiesData: RequiredEntityCreateData[],
    { userID, context }: { userID: number; context: CMSContext }
  ) {
    const requiredEntitiesDataWithIDs = requiredEntitiesData.map((data) => {
      if (!('reprompts' in data)) {
        return { ...data, reprompts: [] };
      }

      if (!data.reprompts.length) {
        return { ...data, repromptID: null };
      }

      return { ...data, repromptID: new ObjectId().toJSON() };
    });

    const responsesCreateData = requiredEntitiesDataWithIDs.reduce<ResponseCreateWithSubResourcesData[]>(
      (acc, data) => {
        if (data.reprompts.length && data.repromptID) {
          acc.push({ id: data.repromptID, name: 'Required entity reprompt', variants: data.reprompts });
        }

        return acc;
      },
      []
    );

    let responseWithSubResources: Awaited<ReturnType<ResponseService['createManyWithSubResources']>> = {
      responses: [],
      responseVariants: [],
      responseAttachments: [],
      responseDiscriminators: [],
    };

    if (responsesCreateData.length) {
      responseWithSubResources = await this.response.createManyWithSubResources(responsesCreateData, {
        userID,
        context,
      });
    }

    const requiredEntities = await this.createManyForUser(
      userID,
      requiredEntitiesDataWithIDs.map((data) => ({
        ...Utils.object.omit(data, ['reprompts']),
        assistantID: context.assistantID,
        environmentID: context.environmentID,
      }))
    );

    return {
      ...responseWithSubResources,
      requiredEntities,
    };
  }

  async createManyAndSync(
    data: RequiredEntityCreateData[],
    { userID, context }: { userID: number; context: CMSContext }
  ) {
    return this.postgresEM.transactional(async () => {
      const result = await this.createManyWithSubResources(data, { userID, context });
      const intents = await this.syncIntents(result.requiredEntities, { action: 'create', userID, context });

      return {
        add: result,
        sync: { intents },
      };
    });
  }

  async broadcastAddMany(
    {
      add,
      sync,
    }: {
      add: {
        responses: ResponseObject[];
        requiredEntities: RequiredEntityObject[];
        responseVariants: AnyResponseVariantObject[];
        responseAttachments: AnyResponseAttachmentObject[];
        responseDiscriminators: ResponseDiscriminatorObject[];
      };
      sync: { intents: IntentObject[] };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.response.broadcastAddMany(
        {
          add: Utils.object.pick(add, [
            'responses',
            'responseVariants',
            'responseAttachments',
            'responseDiscriminators',
          ]),
        },
        meta
      ),

      this.logux.processAs(
        Actions.RequiredEntity.AddMany({
          data: this.mapToJSON(add.requiredEntities),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),

      this.broadcastSync({ sync }, meta),
    ]);
  }

  async patchManyAndSync(
    ids: CMSCompositePK[],
    patch: Partial<Pick<RequiredEntityObject, 'entityID' | 'repromptID'>>,
    { userID, context }: { userID: number; context: CMSContext }
  ) {
    const isEnabled = await this.reference.isFeatureEnabled(userID, context.assistantID);

    return this.postgresEM.transactional(async () => {
      const requiredEntities = await this.orm.patch(ids, { ...patch, updatedByID: userID }, true);

      if (!isEnabled) {
        return {
          add: { references: [], referenceResources: [] },
          delete: { references: [], referenceResources: [] },
        };
      }

      const deleteReferenceResult = await this.reference.deleteManyWithSubResourcesAndSyncByIntentIDs({
        userID,
        intentIDs: Utils.array.unique(requiredEntities.map((entity) => entity.intentID)),
        assistantID: context.assistantID,
        environmentID: context.environmentID,
      });

      const addReferenceResult = await this.reference.createManyWithSubResourcesForRequiredEntities({
        assistantID: context.assistantID,
        environmentID: context.environmentID,
        requiredEntities: this.mapToJSON(requiredEntities),
      });

      return {
        ...deleteReferenceResult,
        ...addReferenceResult,
      };
    });
  }

  async broadcastPatchMany(
    {
      add,
      delete: del,
    }: {
      add: { references: ReferenceObject[]; referenceResources: ReferenceResourceObject[] };
      delete: { references: ReferenceObject[]; referenceResources: ReferenceResourceObject[] };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.reference.broadcastDeleteMany({ delete: del }, meta),
      this.reference.broadcastAddMany({ add }, meta),
    ]);
  }

  async createManyAndBroadcast(data: RequiredEntityCreateData[], meta: CMSBroadcastMeta) {
    const result = await this.createManyAndSync(data, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastAddMany(result, meta);

    return result.add.requiredEntities;
  }

  /* Delete */

  async syncOnDelete(
    requiredEntities: RequiredEntityObject[],
    { userID, context }: { userID: number; context: CMSContext }
  ) {
    const intents = await this.syncIntents(requiredEntities, { action: 'delete', userID, context });

    return { intents };
  }

  deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.deleteManyByEnvironmentAndIDs(environmentID, ids);
  }

  async deleteManyAndSync(ids: string[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const requiredEntities = await this.findManyByEnvironmentAndIDs(context.environmentID, ids);
      const sync = await this.syncOnDelete(requiredEntities, { userID, context });

      await this.deleteManyByEnvironmentAndIDs(context.environmentID, ids);

      return {
        sync,
        delete: { requiredEntities },
      };
    });
  }

  async broadcastDeleteMany(
    { sync, delete: del }: { sync: { intents: IntentObject[] }; delete: { requiredEntities: RequiredEntityObject[] } },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.broadcastSync({ sync }, meta),

      this.logux.processAs(
        Actions.RequiredEntity.DeleteMany({
          ids: toPostgresEntityIDs(del.requiredEntities),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }

  async deleteManyAndBroadcast(ids: string[], meta: CMSBroadcastMeta) {
    const result = await this.deleteManyAndSync(ids, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastDeleteMany(result, meta);
  }
}
