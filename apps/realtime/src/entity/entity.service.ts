/* eslint-disable no-restricted-syntax, no-await-in-loop, max-params */
import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type { EntityEntity, EntityVariantEntity, IntentEntity, ORMMutateOptions, PKOrEntity, RequiredEntityEntity } from '@voiceflow/orm-designer';
import { AssistantORM, EntityORM, FolderORM, Language } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { EntitySerializer, TabularService } from '@/common';
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';
import { RequiredEntityService } from '@/intent/required-entity/required-entity.service';
import { cloneManyEntities } from '@/utils/entity.util';

import type { EntityCreateData } from './entity.interface';
import { EntityVariantService } from './entity-variant/entity-variant.service';

@Injectable()
export class EntityService extends TabularService<EntityORM> {
  constructor(
    @Inject(EntityORM)
    protected readonly orm: EntityORM,
    @Inject(FolderORM)
    protected readonly folderORM: FolderORM,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(EntityVariantService)
    private readonly entityVariant: EntityVariantService,
    @Inject(RequiredEntityService)
    private readonly requiredEntity: RequiredEntityService,
    @Inject(EntitySerializer)
    protected readonly entitySerializer: EntitySerializer
  ) {
    super();
  }

  /* Find */

  async findManyWithSubResourcesByAssistant(assistantID: string, environmentID: string) {
    const [entities, entityVariants] = await Promise.all([
      this.findManyByAssistant(assistantID, environmentID),
      this.entityVariant.findManyByAssistant(assistantID, environmentID),
    ]);

    return {
      entities,
      entityVariants,
    };
  }

  /* Clone */

  async cloneManyWithSubResourcesForEnvironment(
    {
      assistantID,
      sourceEnvironmentID,
      targetEnvironmentID,
    }: {
      assistantID: string;
      sourceEnvironmentID: string;
      targetEnvironmentID: string;
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    const [{ entities: sourceEntities, entityVariants: sourceEntityVariants }, { entities: targetEntities, entityVariants: targetEntityVariants }] =
      await Promise.all([
        this.findManyWithSubResourcesByAssistant(assistantID, sourceEnvironmentID),
        this.findManyWithSubResourcesByAssistant(assistantID, targetEnvironmentID),
      ]);

    await Promise.all([this.deleteMany(targetEntities, { flush: false }), this.entityVariant.deleteMany(targetEntityVariants, { flush: false })]);

    const [entities, entityVariants] = await Promise.all([
      this.createMany(cloneManyEntities(sourceEntities, { environmentID: targetEnvironmentID }), { flush: false }),
      this.entityVariant.createMany(cloneManyEntities(sourceEntityVariants, { environmentID: targetEnvironmentID }), { flush: false }),
    ]);

    if (flush) {
      await this.orm.em.flush();
    }

    return {
      entities,
      entityVariants,
    };
  }

  /* Create */

  async createManyAndSync(userID: number, data: EntityCreateData[]) {
    const entities: EntityEntity[] = [];
    const entityVariants: EntityVariantEntity[] = [];

    for (const { variants: variantsData = [], ...entityData } of data) {
      const entity = await this.createOneForUser(userID, entityData, { flush: false });

      entities.push(entity);

      if (variantsData.length) {
        const variants = await this.entityVariant.createMany(
          variantsData.map(({ value, synonyms }) => ({
            value,
            synonyms,
            language: Language.ENGLISH_US,
            entityID: entity.id,
            assistantID: entity.assistant.id,
            environmentID: entity.environmentID,
          })),
          { flush: false }
        );

        entityVariants.push(...variants);
      }
    }

    await this.orm.em.flush();

    return {
      add: { entities, entityVariants },
    };
  }

  async broadcastAddMany(authMeta: AuthMetaPayload, { add }: { add: { entities: EntityEntity[]; entityVariants: EntityVariantEntity[] } }) {
    await Promise.all([
      this.entityVariant.broadcastAddMany(authMeta, {
        add: Utils.object.pick(add, ['entityVariants']),
      }),

      ...groupByAssistant(add.entities).map((entities) =>
        this.logux.processAs(
          Actions.Entity.AddMany({
            data: this.entitySerializer.iterable(entities),
            context: assistantBroadcastContext(entities[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: EntityCreateData[]) {
    const result = await this.createManyAndSync(authMeta.userID, data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.entities;
  }

  /* Delete */

  async collectRelationsToDelete(entities: PKOrEntity<EntityEntity>[]) {
    const [entityVariants, requiredEntities] = await Promise.all([
      this.entityVariant.findManyByEntities(entities),
      this.requiredEntity.findManyByEntities(entities),
    ]);

    return {
      entityVariants,
      requiredEntities,
    };
  }

  async deleteManyAndSync(ids: Primary<EntityEntity>[]) {
    const entities = await this.findMany(ids);
    const relations = await this.collectRelationsToDelete(entities);

    const sync = await this.requiredEntity.syncOnDelete(relations.requiredEntities, { flush: false });

    await this.deleteMany(entities, { flush: false });

    await this.orm.em.flush();

    return {
      sync,
      delete: { ...relations, entities },
    };
  }

  async broadcastDeleteMany(
    authMeta: AuthMetaPayload,
    {
      sync,
      delete: del,
    }: {
      sync: { intents: IntentEntity[] };
      delete: {
        entities: EntityEntity[];
        entityVariants: EntityVariantEntity[];
        requiredEntities: RequiredEntityEntity[];
      };
    }
  ) {
    await Promise.all([
      this.requiredEntity.broadcastDeleteMany(authMeta, {
        sync,
        delete: Utils.object.pick(del, ['requiredEntities']),
      }),

      this.entityVariant.broadcastDeleteMany(authMeta, {
        delete: Utils.object.pick(del, ['entityVariants']),
      }),

      ...groupByAssistant(del.entities).map((entities) =>
        this.logux.processAs(
          Actions.Entity.DeleteMany({
            ids: toEntityIDs(entities),
            context: assistantBroadcastContext(entities[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<EntityEntity>[]): Promise<void> {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }
}
