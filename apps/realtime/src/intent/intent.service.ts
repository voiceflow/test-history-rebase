/* eslint-disable no-await-in-loop, max-params, no-restricted-syntax */
import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type {
  AnyResponseAttachmentEntity,
  AnyResponseVariantEntity,
  IntentEntity,
  IntentTriggerEntity,
  PKOrEntity,
  PromptEntity,
  RequiredEntityEntity,
  ResponseDiscriminatorEntity,
  ResponseEntity,
  StoryEntity,
  UtteranceEntity,
} from '@voiceflow/orm-designer';
import { AssistantORM, FolderORM, IntentORM, Language } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { EntitySerializer, TabularService } from '@/common';
import { broadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';
import { ResponseService } from '@/response/response.service';
import { TriggerService } from '@/story/trigger/trigger.service';

import type { IntentCreateData } from './intent.interface';
import { RequiredEntityService } from './required-entity/required-entity.service';
import { UtteranceService } from './utterance/utterance.service';

@Injectable()
export class IntentService extends TabularService<IntentORM> {
  constructor(
    @Inject(IntentORM)
    protected readonly orm: IntentORM,
    @Inject(FolderORM)
    protected readonly folderORM: FolderORM,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(TriggerService)
    private readonly trigger: TriggerService,
    @Inject(UtteranceService)
    private readonly utterance: UtteranceService,
    @Inject(RequiredEntityService)
    private readonly requiredEntity: RequiredEntityService,
    @Inject(ResponseService)
    private readonly response: ResponseService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {
    super();
  }

  /* Create */

  async createManyAndSync(userID: number, data: IntentCreateData[]) {
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
        const utterances = await this.utterance.createMany(
          utterancesData.map(({ text }) => ({
            text,
            intentID: intent.id,
            language: Language.ENGLISH_US,
            assistantID: intent.assistant.id,
            environmentID: intent.environmentID,
          })),
          { flush: false }
        );

        utterances.push(...utterances);
      }

      if (requiredEntitiesData.length) {
        for (const requiredEntityData of requiredEntitiesData) {
          let repromptID: string | null;

          // eslint-disable-next-line max-depth
          if ('reprompts' in requiredEntityData) {
            const result = await this.response.createManyWithRefs(
              userID,
              [
                {
                  name: 'Required entity reprompt',
                  variants: requiredEntityData.reprompts,
                  folderID: null,
                  assistantID: intent.assistant.id,
                  environmentID: intent.environmentID,
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

          const [intentRequiredEntity] = await this.requiredEntity.createMany(
            [
              {
                entityID: requiredEntityData.entityID,
                intentID: intent.id,
                repromptID,
                assistantID: intent.assistant.id,
                environmentID: intent.environmentID,
              },
            ],
            { flush: false }
          );

          requiredEntities.push(intentRequiredEntity);
          intent.entityOrder.push(intentRequiredEntity.id);
        }
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

      this.response.broadcastAddMany(authMeta, {
        add: Utils.object.pick(add, ['prompts', 'responses', 'responseVariants', 'responseAttachments', 'responseDiscriminators']),
      }),

      this.requiredEntity.broadcastAddMany(authMeta, {
        add: Utils.object.pick(add, ['requiredEntities']),
        // no need to sync intents, since they should be synced in the create method
        sync: { intents: [] },
      }),

      ...groupByAssistant(add.intents).map((intents) =>
        this.logux.processAs(
          Actions.Intent.AddMany({
            data: this.entitySerializer.iterable(intents),
            context: broadcastContext(intents[0]),
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
    const [triggers, utterances, requiredEntities] = await Promise.all([
      this.trigger.findManyByIntents(intents),
      this.utterance.findManyByIntents(intents),
      this.requiredEntity.findManyByIntents(intents),
    ]);

    return {
      triggers,
      utterances,
      requiredEntities,
    };
  }

  async deleteManyAndSync(ids: Primary<IntentEntity>[]) {
    const intents = await this.findMany(ids);

    const relations = await this.collectRelationsToDelete(intents);

    const sync = await this.trigger.syncOnDelete(relations.triggers, { flush: false });

    await this.deleteMany(intents, { flush: false });

    await this.orm.em.flush();

    return {
      sync,
      delete: { ...relations, intents },
    };
  }

  async broadcastDeleteMany(
    authMeta: AuthMetaPayload,
    {
      sync,
      delete: del,
    }: {
      sync: { stories: StoryEntity[] };
      delete: {
        intents: IntentEntity[];
        triggers: IntentTriggerEntity[];
        utterances: UtteranceEntity[];
        requiredEntities: RequiredEntityEntity[];
      };
    }
  ) {
    await Promise.all([
      this.trigger.broadcastDeleteMany(authMeta, {
        sync: Utils.object.pick(sync, ['stories']),
        delete: Utils.object.pick(del, ['triggers']),
      }),

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
            context: broadcastContext(intents[0]),
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
}
