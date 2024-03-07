/* eslint-disable no-await-in-loop, max-params */
import type { EntityManager } from '@mikro-orm/core';
import { Primary } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { Intent, Language, RequiredEntity, Utterance } from '@voiceflow/dtos';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type {
  AnyResponseAttachmentEntity,
  AnyResponseVariantEntity,
  AssistantEntity,
  IntentEntity,
  ORMMutateOptions,
  PKOrEntity,
  PromptEntity,
  RequiredEntityEntity,
  ResponseDiscriminatorEntity,
  ResponseEntity,
  ToJSONWithForeignKeys,
  UtteranceEntity,
} from '@voiceflow/orm-designer';
import { DatabaseTarget, IntentORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSTabularService, EntitySerializer } from '@/common';
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';
import { cloneManyEntities } from '@/utils/entity.util';

import { IntentExportImportDataDTO } from './dtos/intent-export-import-data.dto';
import type { IntentCreateData } from './intent.interface';
import { RequiredEntityService } from './required-entity/required-entity.service';
import { UtteranceService } from './utterance/utterance.service';

@Injectable()
export class IntentService extends CMSTabularService<IntentORM> {
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
    private readonly requiredEntity: RequiredEntityService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {
    super();
  }

  /* Find */

  async findManyWithSubResourcesByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    const [intents, utterances, requiredEntities] = await Promise.all([
      this.findManyByEnvironment(assistant, environmentID),
      this.utterance.findManyByEnvironment(assistant, environmentID),
      this.requiredEntity.findManyByEnvironment(assistant, environmentID),
    ]);

    return {
      intents,
      utterances,
      requiredEntities,
    };
  }

  async findManyWithSubResourcesJSONByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    const [intents, utterances, requiredEntities] = await Promise.all([
      this.orm.findAllJSON({ assistant, environmentID }),
      this.utterance.findManyJSONByEnvironment(assistant, environmentID),
      this.requiredEntity.findManyJSONByEnvironment(assistant, environmentID),
    ]);

    return {
      intents,
      utterances,
      requiredEntities,
    };
  }

  /* Export */

  prepareExportData(
    {
      intents,
      utterances,
      requiredEntities,
    }: {
      intents: IntentEntity[];
      utterances: UtteranceEntity[];
      requiredEntities: RequiredEntityEntity[];
    },
    { backup }: { backup?: boolean } = {}
  ): IntentExportImportDataDTO {
    const json = {
      intents: this.entitySerializer.iterable(intents),
      utterances: this.entitySerializer.iterable(utterances),
      requiredEntities: this.entitySerializer.iterable(requiredEntities),
    };

    if (backup) {
      return json;
    }

    return this.prepareExportJSONData(json);
  }

  prepareExportJSONData({
    intents,
    utterances,
    requiredEntities,
  }: {
    intents: ToJSONWithForeignKeys<IntentEntity>[];
    utterances: ToJSONWithForeignKeys<UtteranceEntity>[];
    requiredEntities: ToJSONWithForeignKeys<RequiredEntityEntity>[];
  }): IntentExportImportDataDTO {
    return {
      intents: intents.map((item) => Utils.object.omit(item, ['assistantID', 'environmentID'])),
      utterances: utterances.map((item) => Utils.object.omit(item, ['updatedAt', 'updatedByID', 'assistantID', 'environmentID'])),
      requiredEntities: requiredEntities.map((item) => Utils.object.omit(item, ['updatedAt', 'updatedByID', 'assistantID', 'environmentID'])),
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
    const {
      intents: sourceIntents,
      utterances: sourceUtterances,
      requiredEntities: sourceRequiredEntities,
    } = await this.findManyWithSubResourcesByEnvironment(sourceAssistantID, sourceEnvironmentID);

    const result = await this.importManyWithSubResources(
      {
        intents: cloneManyEntities(sourceIntents, { assistantID: targetAssistantID, environmentID: targetEnvironmentID }),
        utterances: cloneManyEntities(sourceUtterances, { assistantID: targetAssistantID, environmentID: targetEnvironmentID }),
        requiredEntities: cloneManyEntities(sourceRequiredEntities, { assistantID: targetAssistantID, environmentID: targetEnvironmentID }),
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
    { intents, utterances, requiredEntities }: IntentExportImportDataDTO,
    { userID, backup, assistantID, environmentID }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ): {
    intents: ToJSONWithForeignKeys<IntentEntity>[];
    utterances: ToJSONWithForeignKeys<UtteranceEntity>[];
    requiredEntities: ToJSONWithForeignKeys<RequiredEntityEntity>[];
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

  async importManyWithSubResources(
    data: {
      intents: ToJSONWithForeignKeys<IntentEntity>[];
      utterances: ToJSONWithForeignKeys<UtteranceEntity>[];
      requiredEntities: ToJSONWithForeignKeys<RequiredEntityEntity>[];
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    const [intents, utterances, requiredEntities] = await Promise.all([
      this.createMany(data.intents, { flush: false }),
      this.utterance.createMany(data.utterances, { flush: false }),
      this.requiredEntity.createMany(data.requiredEntities, { flush: false }),
    ]);

    if (flush) {
      await this.orm.em.flush();
    }

    return {
      intents,
      utterances,
      requiredEntities,
    };
  }

  /* Create */

  async createManyAndSync(userID: number, data: IntentCreateData[]) {
    return this.postgresEM.transactional(async () => {
      const prompts: PromptEntity[] = [];
      const intents: IntentEntity[] = [];
      const responses: ResponseEntity[] = [];
      const utterances: UtteranceEntity[] = [];
      const requiredEntities: RequiredEntityEntity[] = [];
      const responseVariants: AnyResponseVariantEntity[] = [];
      const responseAttachments: AnyResponseAttachmentEntity[] = [];
      const responseDiscriminators: ResponseDiscriminatorEntity[] = [];

      for (const { utterances: utterancesData = [], requiredEntities: requiredEntitiesData = [], ...intentData } of data) {
        const intent = await this.createOneForUser(userID, intentData, { flush: false });
        intents.push(intent);

        if (utterancesData.length) {
          const intentUtterances = await this.utterance.createManyForUser(
            userID,
            utterancesData.map(({ text }) => ({
              text,
              intentID: intent.id,
              language: Language.ENGLISH_US,
              assistantID: intent.assistant.id,
              environmentID: intent.environmentID,
            })),
            { flush: false }
          );

          utterances.push(...intentUtterances);
        }

        if (requiredEntitiesData.length) {
          const result = await this.requiredEntity.createManyWithSubResources(
            userID,
            requiredEntitiesData.map((data) => ({
              ...data,
              intentID: intent.id,
              assistantID: intent.assistant.id,
              environmentID: intent.environmentID,
            })),
            { flush: false }
          );

          prompts.push(...result.prompts);
          responses.push(...result.responses);
          responseVariants.push(...result.responseVariants);
          requiredEntities.push(...result.requiredEntities);
          responseAttachments.push(...result.responseAttachments);
          responseDiscriminators.push(...result.responseDiscriminators);

          intent.entityOrder.push(...result.requiredEntities.map(({ id }) => id));
        }
      }

      await this.orm.em.flush();

      return {
        add: {
          prompts,
          intents,
          responses,
          utterances,
          requiredEntities,
          responseVariants,
          responseAttachments,
          responseDiscriminators,
        },
      };
    });
  }

  async broadcastAddMany(
    authMeta: AuthMetaPayload,
    {
      add,
    }: {
      add: {
        prompts: PromptEntity[];
        intents: IntentEntity[];
        responses: ResponseEntity[];
        utterances: UtteranceEntity[];
        requiredEntities: RequiredEntityEntity[];
        responseVariants: AnyResponseVariantEntity[];
        responseAttachments: AnyResponseAttachmentEntity[];
        responseDiscriminators: ResponseDiscriminatorEntity[];
      };
    }
  ) {
    await Promise.all([
      this.utterance.broadcastAddMany(authMeta, {
        add: Utils.object.pick(add, ['utterances']),
      }),

      this.requiredEntity.broadcastAddMany(authMeta, {
        add: Utils.object.pick(add, [
          'prompts',
          'responses',
          'responseVariants',
          'requiredEntities',
          'responseAttachments',
          'responseDiscriminators',
        ]),
        // no need to sync intents, since they should be synced in the create method
        sync: { intents: [] },
      }),

      ...groupByAssistant(add.intents).map((intents) =>
        this.logux.processAs(
          Actions.Intent.AddMany({
            data: this.entitySerializer.iterable(intents),
            context: assistantBroadcastContext(intents[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: IntentCreateData[]) {
    const result = await this.createManyAndSync(authMeta.userID, data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.intents;
  }

  /* Delete */

  async collectRelationsToDelete(intents: PKOrEntity<IntentEntity>[]) {
    const [utterances, requiredEntities] = await Promise.all([
      this.utterance.findManyByIntents(intents),
      this.requiredEntity.findManyByIntents(intents),
    ]);

    return {
      utterances,
      requiredEntities,
    };
  }

  async deleteManyAndSync(ids: Primary<IntentEntity>[]) {
    return this.postgresEM.transactional(async () => {
      const intents = await this.findMany(ids);

      const relations = await this.collectRelationsToDelete(intents);

      await this.deleteMany(intents, { flush: false });

      await this.orm.em.flush();

      return {
        delete: { ...relations, intents },
      };
    });
  }

  async broadcastDeleteMany(
    authMeta: AuthMetaPayload,
    {
      delete: del,
    }: {
      delete: {
        intents: IntentEntity[];
        // triggers: IntentTriggerEntity[];
        utterances: UtteranceEntity[];
        requiredEntities: RequiredEntityEntity[];
      };
    }
  ) {
    await Promise.all([
      // this.trigger.broadcastDeleteMany(authMeta, {
      //   sync: Utils.object.pick(sync, ['stories']),
      //   delete: Utils.object.pick(del, ['triggers']),
      // }),

      this.utterance.broadcastDeleteMany(authMeta, {
        delete: Utils.object.pick(del, ['utterances']),
      }),

      this.requiredEntity.broadcastDeleteMany(authMeta, {
        // no need to sync intents, because they are deleted
        sync: { intents: [] },
        delete: Utils.object.pick(del, ['requiredEntities']),
      }),

      ...groupByAssistant(del.intents).map((intents) =>
        this.logux.processAs(
          Actions.Intent.DeleteMany({
            ids: toEntityIDs(intents),
            context: assistantBroadcastContext(intents[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<IntentEntity>[]): Promise<void> {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }

  /* Upsert */

  async upsertManyWithSubResources(
    data: { intents: Intent[]; utterances: Utterance[]; requiredEntities: RequiredEntity[] },
    meta: { userID: number; assistantID: string; environmentID: string }
  ) {
    const { intents, utterances, requiredEntities } = this.prepareImportData(data, meta);

    await this.upsertMany(intents);
    await this.utterance.upsertMany(utterances);
    await this.requiredEntity.upsertMany(requiredEntities);
  }
}
