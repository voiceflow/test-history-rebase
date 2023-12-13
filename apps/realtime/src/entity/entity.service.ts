/* eslint-disable no-await-in-loop */
import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { Entity, EntityVariant } from '@voiceflow/dtos';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type {
  EntityEntity,
  EntityVariantEntity,
  IntentEntity,
  ORMMutateOptions,
  PKOrEntity,
  RequiredEntityEntity,
  ToJSONWithForeignKeys,
} from '@voiceflow/orm-designer';
import { EntityORM, Language } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSTabularService, EntitySerializer } from '@/common';
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';
import { RequiredEntityService } from '@/intent/required-entity/required-entity.service';
import { deepSetCreatorID } from '@/utils/creator.util';
import { cloneManyEntities } from '@/utils/entity.util';

import type { EntityCreateData } from './entity.interface';
import { EntityVariantService } from './entity-variant/entity-variant.service';

@Injectable()
export class EntityService extends CMSTabularService<EntityORM> {
  constructor(
    @Inject(EntityORM)
    protected readonly orm: EntityORM,
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

  async findManyWithSubResourcesByEnvironment(assistantID: string, environmentID: string) {
    const [entities, entityVariants] = await Promise.all([
      this.findManyByEnvironment(assistantID, environmentID),
      this.entityVariant.findManyByEnvironment(assistantID, environmentID),
    ]);

    return {
      entities,
      entityVariants,
    };
  }

  /* Export */

  prepareExportData({ entities, entityVariants }: { entities: EntityEntity[]; entityVariants: EntityVariantEntity[] }) {
    return {
      entities: this.entitySerializer.iterable(entities),
      entityVariants: this.entitySerializer.iterable(entityVariants),
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
    const [{ entities: sourceEntities, entityVariants: sourceEntityVariants }, targetEntities] = await Promise.all([
      this.findManyWithSubResourcesByEnvironment(assistantID, sourceEnvironmentID),
      this.findManyByEnvironment(assistantID, targetEnvironmentID),
    ]);

    await this.deleteMany(targetEntities, { flush: false });

    const result = this.importManyWithSubResources(
      {
        entities: cloneManyEntities(sourceEntities, { environmentID: targetEnvironmentID }),
        entityVariants: cloneManyEntities(sourceEntityVariants, { environmentID: targetEnvironmentID }),
      },
      { flush: false }
    );

    if (flush) {
      await this.orm.em.flush();
    }

    return result;
  }

  /* Import */

  prepareImportData(
    { entities, entityVariants }: { entities: ToJSONWithForeignKeys<EntityEntity>[]; entityVariants: ToJSONWithForeignKeys<EntityVariantEntity>[] },
    { userID, backup, assistantID, environmentID }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ) {
    const createdAt = new Date().toJSON();

    return {
      entities: entities.map<ToJSONWithForeignKeys<EntityEntity>>((item) =>
        backup
          ? { ...item, assistantID, environmentID }
          : { ...deepSetCreatorID(item, userID), createdAt, updatedAt: createdAt, assistantID, environmentID }
      ),

      entityVariants: entityVariants.map<ToJSONWithForeignKeys<EntityVariantEntity>>((item) =>
        backup
          ? { ...item, assistantID, environmentID }
          : { ...deepSetCreatorID(item, userID), createdAt, updatedAt: createdAt, assistantID, environmentID }
      ),
    };
  }

  async importManyWithSubResources(
    data: {
      entities: ToJSONWithForeignKeys<EntityEntity>[];
      entityVariants: ToJSONWithForeignKeys<EntityVariantEntity>[];
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    const [entities, entityVariants] = await Promise.all([
      this.createMany(data.entities, { flush: false }),
      this.entityVariant.createMany(data.entityVariants, { flush: false }),
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
            updatedByID: userID,
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

  /* Upsert */

  async upsertManyWithSubResources({ entities, entityVariants }: { entities: Entity[]; entityVariants: EntityVariant[] }) {
    await this.upsertMany(entities);
    await this.entityVariant.upsertMany(entityVariants);
  }
}
