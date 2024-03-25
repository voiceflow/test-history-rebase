import type { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { Intent, Language, RequiredEntity, Utterance } from '@voiceflow/dtos';
import { LoguxService } from '@voiceflow/nestjs-logux';
import type {
  AnyResponseAttachmentObject,
  AnyResponseVariantObject,
  IntentJSON,
  IntentObject,
  RequiredEntityJSON,
  RequiredEntityObject,
  ResponseDiscriminatorObject,
  ResponseObject,
  UtteranceJSON,
  UtteranceObject,
} from '@voiceflow/orm-designer';
import { DatabaseTarget, IntentORM, ObjectId } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSTabularService } from '@/common';
import { cmsBroadcastContext, toPostgresEntityIDs } from '@/common/utils';
import { CMSBroadcastMeta, CMSContext } from '@/types';

import { IntentExportImportDataDTO } from './dtos/intent-export-import-data.dto';
import type { IntentCreateData } from './intent.interface';
import { RequiredEntityService } from './required-entity/required-entity.service';
import { UtteranceService } from './utterance/utterance.service';

@Injectable()
export class IntentService extends CMSTabularService<IntentORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(IntentORM)
    protected readonly orm: IntentORM,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(UtteranceService)
    private readonly utterance: UtteranceService,
    @Inject(RequiredEntityService)
    private readonly requiredEntity: RequiredEntityService
  ) {
    super();
  }

  /* Find */

  async findManyWithSubResourcesByEnvironment(environmentID: string) {
    const [intents, utterances, requiredEntities] = await Promise.all([
      this.findManyByEnvironment(environmentID),
      this.utterance.findManyByEnvironment(environmentID),
      this.requiredEntity.findManyByEnvironment(environmentID),
    ]);

    return {
      intents,
      utterances,
      requiredEntities,
    };
  }

  /* Export */

  toJSONWithSubResources({
    intents,
    utterances,
    requiredEntities,
  }: {
    intents: IntentObject[];
    utterances: UtteranceObject[];
    requiredEntities: RequiredEntityObject[];
  }) {
    return {
      intents: this.mapToJSON(intents),
      utterances: this.utterance.mapToJSON(utterances),
      requiredEntities: this.requiredEntity.mapToJSON(requiredEntities),
    };
  }

  fromJSONWithSubResources({ intents, utterances, requiredEntities }: IntentExportImportDataDTO) {
    return {
      intents: this.mapFromJSON(intents),
      utterances: this.utterance.mapFromJSON(utterances),
      requiredEntities: this.requiredEntity.mapFromJSON(requiredEntities),
    };
  }

  prepareExportData(
    data: {
      intents: IntentObject[];
      utterances: UtteranceObject[];
      requiredEntities: RequiredEntityObject[];
    },
    { backup }: { backup?: boolean } = {}
  ): IntentExportImportDataDTO {
    const json = this.toJSONWithSubResources(data);

    if (backup) {
      return json;
    }

    return {
      intents: json.intents.map((item) => Utils.object.omit(item, ['assistantID', 'environmentID'])),
      utterances: json.utterances.map((item) => Utils.object.omit(item, ['updatedAt', 'updatedByID', 'assistantID', 'environmentID'])),
      requiredEntities: json.requiredEntities.map((item) => Utils.object.omit(item, ['updatedAt', 'updatedByID', 'assistantID', 'environmentID'])),
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
    const {
      intents: sourceIntents,
      utterances: sourceUtterances,
      requiredEntities: sourceRequiredEntities,
    } = await this.findManyWithSubResourcesByEnvironment(sourceEnvironmentID);

    return this.importManyWithSubResources({
      intents: sourceIntents.map((item) => ({ ...item, assistantID: targetAssistantID, environmentID: targetEnvironmentID })),
      utterances: sourceUtterances.map((item) => ({ ...item, assistantID: targetAssistantID, environmentID: targetEnvironmentID })),
      requiredEntities: sourceRequiredEntities.map((item) => ({ ...item, assistantID: targetAssistantID, environmentID: targetEnvironmentID })),
    });
  }

  /* Import */

  prepareImportData(
    { intents, utterances, requiredEntities }: IntentExportImportDataDTO,
    { userID, backup, assistantID, environmentID }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ): {
    intents: IntentJSON[];
    utterances: UtteranceJSON[];
    requiredEntities: RequiredEntityJSON[];
  } {
    const createdAt = new Date().toJSON();

    if (backup) {
      return {
        intents: intents.map((item) => ({
          ...item,
          assistantID,
          environmentID,
        })),

        utterances: utterances.map((item) => ({
          ...item,
          updatedAt: item.updatedAt ?? createdAt,
          updatedByID: item.updatedByID ?? userID,
          assistantID,
          environmentID,
        })),

        requiredEntities: requiredEntities.map((item) => ({
          ...item,
          updatedAt: item.updatedAt ?? createdAt,
          updatedByID: item.updatedByID ?? userID,
          assistantID,
          environmentID,
        })),
      };
    }

    return {
      intents: intents.map((item) => ({
        ...item,
        createdAt,
        updatedAt: createdAt,
        createdByID: userID,
        updatedByID: userID,
        assistantID,
        environmentID,
      })),

      utterances: utterances.map((item) => ({
        ...item,
        createdAt,
        updatedAt: createdAt,
        updatedByID: userID,
        assistantID,
        environmentID,
      })),

      requiredEntities: requiredEntities.map((item) => ({
        ...item,
        createdAt,
        updatedAt: createdAt,
        updatedByID: userID,
        assistantID,
        environmentID,
      })),
    };
  }

  async importManyWithSubResources(data: { intents: IntentObject[]; utterances: UtteranceObject[]; requiredEntities: RequiredEntityObject[] }) {
    const intents = await this.createMany(data.intents);

    const [utterances, requiredEntities] = await Promise.all([
      this.utterance.createMany(data.utterances),
      this.requiredEntity.createMany(data.requiredEntities),
    ]);

    return {
      intents,
      utterances,
      requiredEntities,
    };
  }

  /* Create */

  async createManyAndSync(data: IntentCreateData[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const dataWithIDs = data.map(({ id, utterances, requiredEntities, ...item }) => {
        const intentID = id ?? new ObjectId().toJSON();

        const utterancesWithIDs = utterances?.map((utterance) => ({
          ...utterance,
          id: new ObjectId().toJSON(),
          language: Language.ENGLISH_US,
          intentID,
          assistantID: context.assistantID,
          environmentID: context.environmentID,
        }));

        const requiredEntitiesDataWithIDs = requiredEntities?.map((requiredEntity) => ({
          ...requiredEntity,
          id: new ObjectId().toJSON(),
          intentID,
          assistantID: context.assistantID,
          environmentID: context.environmentID,
        }));

        return {
          ...item,
          id: intentID,
          utterances: utterancesWithIDs ?? [],
          assistantID: context.assistantID,
          entityOrder: toPostgresEntityIDs(requiredEntitiesDataWithIDs ?? []),
          environmentID: context.environmentID,
          requiredEntities: requiredEntitiesDataWithIDs ?? [],
        };
      });

      const intents = await this.createManyForUser(
        userID,
        dataWithIDs.map((item) => Utils.object.omit(item, ['utterances', 'requiredEntities']))
      );

      const utterances = await this.utterance.createManyForUser(
        userID,
        dataWithIDs.flatMap((item) => item.utterances)
      );

      const requiredEntitiesWithSubResources = await this.requiredEntity.createManyWithSubResources(
        dataWithIDs.flatMap((item) => item.requiredEntities),
        { userID, context }
      );

      return {
        add: {
          ...requiredEntitiesWithSubResources,
          intents,
          utterances,
        },
      };
    });
  }

  async broadcastAddMany(
    {
      add,
    }: {
      add: {
        intents: IntentObject[];
        responses: ResponseObject[];
        utterances: UtteranceObject[];
        requiredEntities: RequiredEntityObject[];
        responseVariants: AnyResponseVariantObject[];
        responseAttachments: AnyResponseAttachmentObject[];
        responseDiscriminators: ResponseDiscriminatorObject[];
      };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.utterance.broadcastAddMany({ add: Utils.object.pick(add, ['utterances']) }, meta),

      this.requiredEntity.broadcastAddMany(
        {
          add: Utils.object.pick(add, ['responses', 'responseVariants', 'requiredEntities', 'responseAttachments', 'responseDiscriminators']),
          // no need to sync intents, since they should be synced in the create method
          sync: { intents: [] },
        },
        meta
      ),

      this.logux.processAs(
        Actions.Intent.AddMany({
          data: this.mapToJSON(add.intents),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }

  async createManyAndBroadcast(data: IntentCreateData[], meta: CMSBroadcastMeta) {
    const result = await this.createManyAndSync(data, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastAddMany(result, meta);

    return result.add.intents;
  }

  /* Delete */

  async collectRelationsToDelete(environmentID: string, intentIDs: string[]) {
    const [utterances, requiredEntities] = await Promise.all([
      this.utterance.findManyByIntents(environmentID, intentIDs),
      this.requiredEntity.findManyByIntents(environmentID, intentIDs),
    ]);

    return {
      utterances,
      requiredEntities,
    };
  }

  async deleteManyAndSync(ids: string[], context: CMSContext) {
    return this.postgresEM.transactional(async () => {
      const [intents, relations] = await Promise.all([
        this.findManyByEnvironmentAndIDs(context.environmentID, ids),
        this.collectRelationsToDelete(context.environmentID, ids),
      ]);

      await this.deleteManyByEnvironmentAndIDs(context.environmentID, ids);

      return {
        delete: { ...relations, intents },
      };
    });
  }

  async broadcastDeleteMany(
    {
      delete: del,
    }: {
      delete: {
        intents: IntentObject[];
        utterances: UtteranceObject[];
        requiredEntities: RequiredEntityObject[];
      };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.utterance.broadcastDeleteMany({ delete: Utils.object.pick(del, ['utterances']) }, meta),
      // no need to sync intents, because they are deleted
      this.requiredEntity.broadcastDeleteMany({ sync: { intents: [] }, delete: Utils.object.pick(del, ['requiredEntities']) }, meta),

      this.logux.processAs(
        Actions.Intent.DeleteMany({
          ids: toPostgresEntityIDs(del.intents),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }

  async deleteManyAndBroadcast(ids: string[], meta: CMSBroadcastMeta): Promise<void> {
    const result = await this.deleteManyAndSync(ids, meta.context);

    await this.broadcastDeleteMany(result, meta);
  }

  /* Upsert */

  async upsertManyWithSubResources(
    data: { intents: Intent[]; utterances: Utterance[]; requiredEntities: RequiredEntity[] },
    meta: { userID: number; assistantID: string; environmentID: string }
  ) {
    const { intents, utterances, requiredEntities } = this.prepareImportData(data, meta);

    await this.upsertMany(this.mapFromJSON(intents));
    await this.utterance.upsertMany(this.utterance.mapFromJSON(utterances));
    await this.requiredEntity.upsertMany(this.requiredEntity.mapFromJSON(requiredEntities));
  }
}
