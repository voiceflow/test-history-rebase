/* eslint-disable max-params */
/* eslint-disable no-await-in-loop */
import type { EntityManager } from '@mikro-orm/core';
import { Primary } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { NotFoundException } from '@voiceflow/exception';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type {
  AnyResponseAttachmentEntity,
  AnyResponseVariantEntity,
  AssistantEntity,
  EntityEntity,
  IntentEntity,
  ORMMutateOptions,
  PKOrEntity,
  PromptEntity,
  RequiredEntityEntity,
  ResponseDiscriminatorEntity,
  ResponseEntity,
} from '@voiceflow/orm-designer';
import { DatabaseTarget, EntityORM, IntentORM, RequiredEntityORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSObjectService, EntitySerializer } from '@/common';
import { assistantBroadcastContext, groupByAssistant, toEntityID, toEntityIDs } from '@/common/utils';
import { ResponseService } from '@/response/response.service';
import { uniqCMSResourceIDs } from '@/utils/cms.util';

import { RequiredEntityCreateData } from './required-entity.interface';

@Injectable()
export class RequiredEntityService extends CMSObjectService<RequiredEntityORM> {
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
    @Inject(EntitySerializer)
    protected readonly entitySerializer: EntitySerializer
  ) {
    super();
  }

  /* Helpers */

  protected async syncIntents(requiredEntities: RequiredEntityEntity[], { flush = true, action }: { flush?: boolean; action: 'create' | 'delete' }) {
    const intentIDs = uniqCMSResourceIDs(requiredEntities.map(({ intent }) => ({ id: intent.id, environmentID: intent.environmentID })));

    const intents = await this.intentORM.findMany(intentIDs);

    if (intentIDs.length !== intents.length) {
      throw new NotFoundException("couldn't find intent to sync");
    }

    const requiredEntitiesByIntentID = requiredEntities.reduce<Record<string, typeof requiredEntities>>((acc, entity) => {
      acc[entity.intent.id] ??= [];
      acc[entity.intent.id].push(entity);

      return acc;
    }, {});

    intents.forEach((intent) => {
      const entityIDs = requiredEntitiesByIntentID[intent.id]?.map(toEntityID);

      if (!entityIDs?.length) {
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
    });

    if (flush) {
      await this.orm.em.flush();
    }

    return intents;
  }

  async broadcastSync(authMeta: AuthMetaPayload, { sync }: { sync: { intents: IntentEntity[] } }) {
    await Promise.all(
      groupByAssistant(sync.intents).flatMap((intents) =>
        intents.map((intent) =>
          this.logux.processAs(
            Actions.Intent.PatchOne({
              id: intent.id,
              patch: { entityOrder: intent.entityOrder },
              context: assistantBroadcastContext(intent),
            }),
            authMeta
          )
        )
      )
    );
  }

  /* Find */

  findManyByIntents(intents: PKOrEntity<IntentEntity>[]) {
    return this.orm.findManyByIntents(intents);
  }

  findManyByEntities(entities: PKOrEntity<EntityEntity>[]) {
    return this.orm.findManyByEntities(entities);
  }

  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findManyByEnvironment(assistant, environmentID);
  }

  /* Create */

  async createManyWithSubResources(userID: number, requiredEntitiesData: RequiredEntityCreateData[], { flush = true }: ORMMutateOptions = {}) {
    const prompts: PromptEntity[] = [];
    const responses: ResponseEntity[] = [];
    const requiredEntities: RequiredEntityEntity[] = [];
    const responseVariants: AnyResponseVariantEntity[] = [];
    const responseAttachments: AnyResponseAttachmentEntity[] = [];
    const responseDiscriminators: ResponseDiscriminatorEntity[] = [];

    let repromptID: string | null;

    for (const requiredEntityData of requiredEntitiesData) {
      if ('reprompts' in requiredEntityData) {
        const result = await this.response.createManyWithSubResources(
          userID,
          [
            {
              name: 'Required entity reprompt',
              variants: requiredEntityData.reprompts,
              folderID: null,
              assistantID: requiredEntityData.assistantID,
              environmentID: requiredEntityData.environmentID,
            },
          ],
          { flush: false }
        );

        repromptID = result.responses[0].id;

        prompts.push(...result.prompts);
        responses.push(...result.responses);
        responseVariants.push(...result.responseVariants);
        responseAttachments.push(...result.responseAttachments);
        responseDiscriminators.push(...result.responseDiscriminators);
      } else {
        repromptID = requiredEntityData.repromptID;
      }

      const requiredEntity = await this.createOneForUser(
        userID,
        {
          entityID: requiredEntityData.entityID,
          intentID: requiredEntityData.intentID,
          repromptID,
          assistantID: requiredEntityData.assistantID,
          environmentID: requiredEntityData.environmentID,
        },
        { flush: false }
      );

      requiredEntities.push(requiredEntity);
    }

    if (flush) {
      await this.orm.em.flush();
    }

    return {
      prompts,
      responses,
      requiredEntities,
      responseVariants,
      responseAttachments,
      responseDiscriminators,
    };
  }

  async createManyAndSync(userID: number, data: RequiredEntityCreateData[]) {
    return this.postgresEM.transactional(async () => {
      const result = await this.createManyWithSubResources(userID, data, { flush: false });
      const intents = await this.syncIntents(result.requiredEntities, { flush: false, action: 'create' });

      await this.orm.em.flush();

      return {
        add: result,
        sync: { intents },
      };
    });
  }

  async broadcastAddMany(
    authMeta: AuthMetaPayload,
    {
      add,
      sync,
    }: {
      add: {
        prompts: PromptEntity[];
        responses: ResponseEntity[];
        requiredEntities: RequiredEntityEntity[];
        responseVariants: AnyResponseVariantEntity[];
        responseAttachments: AnyResponseAttachmentEntity[];
        responseDiscriminators: ResponseDiscriminatorEntity[];
      };
      sync: { intents: IntentEntity[] };
    }
  ) {
    await Promise.all([
      this.response.broadcastAddMany(authMeta, {
        add: Utils.object.pick(add, ['prompts', 'responses', 'responseVariants', 'responseAttachments', 'responseDiscriminators']),
      }),

      ...groupByAssistant(add.requiredEntities).map((requiredEntities) =>
        this.logux.processAs(
          Actions.RequiredEntity.AddMany({
            data: this.entitySerializer.iterable(requiredEntities),
            context: assistantBroadcastContext(requiredEntities[0]),
          }),
          authMeta
        )
      ),
      this.broadcastSync(authMeta, { sync }),
    ]);
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: RequiredEntityCreateData[]) {
    const result = await this.createManyAndSync(authMeta.userID, data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.requiredEntities;
  }

  /* Delete */

  async syncOnDelete(requiredEntities: RequiredEntityEntity[], options?: ORMMutateOptions) {
    const intents = await this.syncIntents(requiredEntities, { ...options, action: 'delete' });

    return { intents };
  }

  async deleteManyAndSync(ids: Primary<RequiredEntityEntity>[]) {
    return this.postgresEM.transactional(async () => {
      const requiredEntities = await this.findMany(ids);

      const sync = await this.syncOnDelete(requiredEntities, { flush: false });

      await this.deleteMany(requiredEntities, { flush: false });

      await this.orm.em.flush();

      return {
        sync,
        delete: { requiredEntities },
      };
    });
  }

  async broadcastDeleteMany(
    authMeta: AuthMetaPayload,
    { sync, delete: del }: { sync: { intents: IntentEntity[] }; delete: { requiredEntities: RequiredEntityEntity[] } }
  ) {
    await Promise.all([
      this.broadcastSync(authMeta, { sync }),
      ...groupByAssistant(del.requiredEntities).map((requiredEntities) =>
        this.logux.processAs(
          Actions.RequiredEntity.DeleteMany({
            ids: toEntityIDs(requiredEntities),
            context: assistantBroadcastContext(requiredEntities[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<RequiredEntityEntity>[]) {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }
}
