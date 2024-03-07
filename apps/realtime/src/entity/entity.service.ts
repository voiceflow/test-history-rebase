/* eslint-disable max-params */
/* eslint-disable no-await-in-loop */
import type { EntityManager } from '@mikro-orm/core';
import { Primary } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { Entity, EntityVariant, Language } from '@voiceflow/dtos';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type {
  AssistantEntity,
  EntityEntity,
  EntityVariantEntity,
  IntentEntity,
  ORMMutateOptions,
  PKOrEntity,
  RequiredEntityEntity,
  ToJSONWithForeignKeys,
} from '@voiceflow/orm-designer';
import { DatabaseTarget, EntityORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSTabularService, EntitySerializer } from '@/common';
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';
import { RequiredEntityService } from '@/intent/required-entity/required-entity.service';
import { cloneManyEntities } from '@/utils/entity.util';

import type { EntityExportImportDataDTO } from './dtos/entity-export-import-data.dto';
import type { EntityCreateData } from './entity.interface';
import { EntityVariantService } from './entity-variant/entity-variant.service';

@Injectable()
export class EntityService extends CMSTabularService<EntityORM> {
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
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

  async findManyWithSubResourcesByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    const [entities, entityVariants] = await Promise.all([
      this.findManyByEnvironment(assistant, environmentID),
      this.entityVariant.findManyByEnvironment(assistant, environmentID),
    ]);

    return {
      entities,
      entityVariants,
    };
  }

  async findManyWithSubResourcesJSONByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    const [entities, entityVariants] = await Promise.all([
      this.orm.findAllJSON({ assistant, environmentID }),
      this.entityVariant.findManyJSONByEnvironment(assistant, environmentID),
    ]);

    return {
      entities,
      entityVariants,
    };
  }

  /* Export */

  prepareExportData(
    { entities, entityVariants }: { entities: EntityEntity[]; entityVariants: EntityVariantEntity[] },
    { backup }: { backup?: boolean } = {}
  ): EntityExportImportDataDTO {
    const json = {
      entities: this.entitySerializer.iterable(entities),
      entityVariants: this.entitySerializer.iterable(entityVariants),
    };

    if (backup) {
      return json;
    }

    return this.prepareExportJSONData(json);
  }

  prepareExportJSONData({
    entities,
    entityVariants,
  }: {
    entities: ToJSONWithForeignKeys<EntityEntity>[];
    entityVariants: ToJSONWithForeignKeys<EntityVariantEntity>[];
  }): EntityExportImportDataDTO {
    return {
      entities: entities.map((item) => Utils.object.omit(item, ['assistantID', 'environmentID'])),
      entityVariants: entityVariants.map((item) => Utils.object.omit(item, ['updatedAt', 'updatedByID', 'assistantID', 'environmentID'])),
    };
  }

  /* Clone */

  async cloneManyWithSubResourcesForEnvironment(
    {
      sourceAssistantID,
      targetAssistantID,
      sourceEnvironmentID,
      targetEnvironmentID,
    }: {
      sourceAssistantID: string;
      targetAssistantID: string;
      sourceEnvironmentID: string;
      targetEnvironmentID: string;
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    const { entities: sourceEntities, entityVariants: sourceEntityVariants } = await this.findManyWithSubResourcesByEnvironment(
      sourceAssistantID,
      sourceEnvironmentID
    );

    const result = this.importManyWithSubResources(
      {
        entities: cloneManyEntities(sourceEntities, { assistantID: targetAssistantID, environmentID: targetEnvironmentID }),
        entityVariants: cloneManyEntities(sourceEntityVariants, { assistantID: targetAssistantID, environmentID: targetEnvironmentID }),
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
    { entities, entityVariants }: EntityExportImportDataDTO,
    { userID, backup, assistantID, environmentID }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ): {
    entities: ToJSONWithForeignKeys<EntityEntity>[];
    entityVariants: ToJSONWithForeignKeys<EntityVariantEntity>[];
  } {
    const createdAt = new Date().toJSON();

    if (backup) {
      return {
        entities: entities.map((item) => ({
          ...item,
          assistantID,
          environmentID,
        })),

        entityVariants: entityVariants.map((item) => ({
          ...item,
          updatedAt: item.updatedAt ?? createdAt,
          updatedByID: item.updatedByID ?? userID,
          assistantID,
          environmentID,
        })),
      };
    }

    return {
      entities: entities.map((item) => ({
        ...item,
        createdAt,
        updatedAt: createdAt,
        createdByID: userID,
        updatedByID: userID,
        assistantID,
        environmentID,
      })),

      entityVariants: entityVariants.map((item) => ({
        ...item,
        createdAt,
        updatedAt: createdAt,
        updatedByID: userID,
        assistantID,
        environmentID,
      })),
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
    return this.postgresEM.transactional(async () => {
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
    });
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

  async syncRelationsOnDelete(
    relations: { entityVariants: EntityVariantEntity[]; requiredEntities: RequiredEntityEntity[] },
    { flush = true }: ORMMutateOptions = {}
  ) {
    const sync = await this.requiredEntity.syncOnDelete(relations.requiredEntities, { flush: false });

    if (flush) {
      await this.orm.em.flush();
    }

    return sync;
  }

  async deleteManyAndSync(ids: Primary<EntityEntity>[]) {
    return this.postgresEM.transactional(async () => {
      const entities = await this.findMany(ids);
      const relations = await this.collectRelationsToDelete(entities);

      const sync = await this.syncRelationsOnDelete(relations, { flush: false });

      await this.deleteMany(entities, { flush: false });

      await this.orm.em.flush();

      return {
        sync,
        delete: { ...relations, entities },
      };
    });
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

  async upsertManyWithSubResources(
    data: { entities: Entity[]; entityVariants: EntityVariant[] },
    meta: { userID: number; assistantID: string; environmentID: string }
  ) {
    const { entities, entityVariants } = this.prepareImportData(data, meta);

    await this.upsertMany(entities);

    await this.entityVariant.upsertMany(entityVariants);
  }
}
