import type { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { Entity, EntityVariant, Language } from '@voiceflow/dtos';
import { LoguxService } from '@voiceflow/nestjs-logux';
import type {
  EntityJSON,
  EntityObject,
  EntityVariantJSON,
  EntityVariantObject,
  IntentObject,
  RequiredEntityObject,
} from '@voiceflow/orm-designer';
import { DatabaseTarget, EntityORM, ObjectId } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSTabularService } from '@/common';
import { cmsBroadcastContext, injectAssistantAndEnvironmentIDs, toPostgresEntityIDs } from '@/common/utils';
import { RequiredEntityService } from '@/intent/required-entity/required-entity.service';
import { CMSBroadcastMeta, CMSContext } from '@/types';

import type { EntityExportImportDataDTO } from './dtos/entity-export-import-data.dto';
import type { EntityCreateData } from './entity.interface';
import { EntityVariantService } from './entity-variant/entity-variant.service';

@Injectable()
export class EntityService extends CMSTabularService<EntityORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

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
    private readonly requiredEntity: RequiredEntityService
  ) {
    super();
  }

  /* Find */

  async findManyWithSubResourcesByEnvironment(environmentID: string) {
    const [entities, entityVariants] = await Promise.all([
      this.findManyByEnvironment(environmentID),
      this.entityVariant.findManyByEnvironment(environmentID),
    ]);

    return {
      entities,
      entityVariants,
    };
  }

  /* Export */

  toJSONWithSubResources({
    entities,
    entityVariants,
  }: {
    entities: EntityObject[];
    entityVariants: EntityVariantObject[];
  }) {
    return {
      entities: this.mapToJSON(entities),
      entityVariants: this.entityVariant.mapToJSON(entityVariants),
    };
  }

  fromJSONWithSubResources({ entities, entityVariants }: EntityExportImportDataDTO) {
    return {
      entities: this.mapFromJSON(entities),
      entityVariants: this.entityVariant.mapFromJSON(entityVariants),
    };
  }

  prepareExportData(
    data: { entities: EntityObject[]; entityVariants: EntityVariantObject[] },
    { backup }: { backup?: boolean } = {}
  ): EntityExportImportDataDTO {
    const json = this.toJSONWithSubResources(data);

    if (backup) {
      return json;
    }

    return {
      entities: json.entities.map((item) => Utils.object.omit(item, ['assistantID', 'environmentID'])),
      entityVariants: json.entityVariants.map((item) =>
        Utils.object.omit(item, ['updatedAt', 'updatedByID', 'assistantID', 'environmentID'])
      ),
    };
  }

  /* Clone */

  async cloneManyWithSubResourcesForEnvironment({
    targetAssistantID,
    sourceEnvironmentID,
    targetEnvironmentID,
  }: {
    targetAssistantID: string;
    sourceEnvironmentID: string;
    targetEnvironmentID: string;
  }) {
    const { entities: sourceEntities, entityVariants: sourceEntityVariants } =
      await this.findManyWithSubResourcesByEnvironment(sourceEnvironmentID);

    const injectContext = { assistantID: targetAssistantID, environmentID: targetEnvironmentID };

    return this.importManyWithSubResources({
      entities: sourceEntities.map(injectAssistantAndEnvironmentIDs(injectContext)),
      entityVariants: sourceEntityVariants.map(injectAssistantAndEnvironmentIDs(injectContext)),
    });
  }

  /* Import */

  prepareImportData(
    { entities, entityVariants }: EntityExportImportDataDTO,
    {
      userID,
      backup,
      assistantID,
      environmentID,
    }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ): {
    entities: EntityJSON[];
    entityVariants: EntityVariantJSON[];
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

  async importManyWithSubResources(data: { entities: EntityObject[]; entityVariants: EntityVariantObject[] }) {
    const entities = await this.createMany(data.entities);
    const entityVariants = await this.entityVariant.createMany(data.entityVariants);

    return {
      entities,
      entityVariants,
    };
  }

  /* Create */

  async createManyAndSync(data: EntityCreateData[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const dataWithIDs = data.map(({ id, variants, ...item }) => {
        const entityID = id ?? new ObjectId().toJSON();

        const variantsWithIDs = variants?.map((variant) => ({
          ...variant,
          id: new ObjectId().toJSON(),
          entityID,
          language: Language.ENGLISH_US,
          updatedByID: userID,
          assistantID: context.assistantID,
          environmentID: context.environmentID,
        }));

        return {
          ...item,
          id: entityID,
          variants: variantsWithIDs,
          assistantID: context.assistantID,
          environmentID: context.environmentID,
        };
      });

      const entities = await this.createManyForUser(
        userID,
        dataWithIDs.map((item) => Utils.object.omit(item, ['variants']))
      );

      const entityVariants = await this.entityVariant.createMany(dataWithIDs.flatMap((item) => item.variants ?? []));

      return {
        add: { entities, entityVariants },
      };
    });
  }

  async broadcastAddMany(
    { add }: { add: { entities: EntityObject[]; entityVariants: EntityVariantObject[] } },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.entityVariant.broadcastAddMany({ add: Utils.object.pick(add, ['entityVariants']) }, meta),

      this.logux.processAs(
        Actions.Entity.AddMany({
          data: this.mapToJSON(add.entities),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }

  async createManyAndBroadcast(data: EntityCreateData[], meta: CMSBroadcastMeta) {
    const result = await this.createManyAndSync(data, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastAddMany(result, meta);

    return result.add.entities;
  }

  /* Delete */

  async collectRelationsToDelete(environmentID: string, entityIDs: string[]) {
    const [entityVariants, requiredEntities] = await Promise.all([
      this.entityVariant.findManyByEntities(environmentID, entityIDs),
      this.requiredEntity.findManyByEntities(environmentID, entityIDs),
    ]);

    return {
      entityVariants,
      requiredEntities,
    };
  }

  syncRelationsOnDelete(
    relations: { entityVariants: EntityVariantObject[]; requiredEntities: RequiredEntityObject[] },
    { userID, context }: { userID: number; context: CMSContext }
  ) {
    return this.requiredEntity.syncOnDelete(relations.requiredEntities, { userID, context });
  }

  async deleteManyAndSync(ids: string[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const [entities, relations] = await Promise.all([
        this.findManyByEnvironmentAndIDs(context.environmentID, ids),
        this.collectRelationsToDelete(context.environmentID, ids),
      ]);
      const sync = await this.syncRelationsOnDelete(relations, { userID, context });

      await this.deleteManyByEnvironmentAndIDs(context.environmentID, ids);

      return {
        sync,
        delete: { ...relations, entities },
      };
    });
  }

  async broadcastDeleteMany(
    {
      sync,
      delete: del,
    }: {
      sync: { intents: IntentObject[] };
      delete: {
        entities: EntityObject[];
        entityVariants: EntityVariantObject[];
        requiredEntities: RequiredEntityObject[];
      };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.requiredEntity.broadcastDeleteMany({ sync, delete: Utils.object.pick(del, ['requiredEntities']) }, meta),
      this.entityVariant.broadcastDeleteMany({ delete: Utils.object.pick(del, ['entityVariants']) }, meta),

      this.logux.processAs(
        Actions.Entity.DeleteMany({
          ids: toPostgresEntityIDs(del.entities),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }

  async deleteManyAndBroadcast(ids: string[], meta: CMSBroadcastMeta): Promise<void> {
    const result = await this.deleteManyAndSync(ids, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastDeleteMany(result, meta);
  }

  /* Upsert */

  async upsertManyWithSubResources(
    data: { entities: Entity[]; entityVariants: EntityVariant[] },
    meta: { userID: number; assistantID: string; environmentID: string }
  ) {
    const { entities, entityVariants } = this.prepareImportData(data, meta);

    await this.upsertMany(this.mapFromJSON(entities));
    await this.entityVariant.upsertMany(this.entityVariant.mapFromJSON(entityVariants));
  }
}
