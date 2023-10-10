/* eslint-disable no-await-in-loop, no-restricted-syntax */
import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type {
  AnyResponseAttachmentEntity,
  AnyResponseVariantEntity,
  ORMMutateOptions,
  PKOrEntity,
  PromptEntity,
  RequiredEntityEntity,
  ResponseDiscriminatorEntity,
  ResponseEntity,
} from '@voiceflow/orm-designer';
import { AssistantORM, Channel, FolderORM, Language, RequiredEntityORM, ResponseORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { EntitySerializer, TabularService } from '@/common';
import { broadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';

import { ResponseCreateRefData } from './response.interface';
import { ResponseDiscriminatorService } from './response-discriminator/response-discriminator.service';
import { ResponseVariantService } from './response-variant/response-variant.service';

@Injectable()
export class ResponseService extends TabularService<ResponseORM> {
  // eslint-disable-next-line max-params
  constructor(
    @Inject(ResponseORM)
    protected readonly orm: ResponseORM,
    @Inject(FolderORM)
    protected readonly folderORM: FolderORM,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM,
    @Inject(RequiredEntityORM)
    protected readonly requiredEntityORM: RequiredEntityORM,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(ResponseVariantService)
    private readonly responseVariant: ResponseVariantService,
    @Inject(ResponseDiscriminatorService)
    private readonly responseDiscriminator: ResponseDiscriminatorService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {
    super();
  }

  /* Create */

  async createManyWithRefs(userID: number, data: ResponseCreateRefData[], { flush = true }: ORMMutateOptions = {}) {
    const prompts: PromptEntity[] = [];
    const responses: ResponseEntity[] = [];
    const responseVariants: AnyResponseVariantEntity[] = [];
    const responseAttachments: AnyResponseAttachmentEntity[] = [];
    const responseDiscriminators: ResponseDiscriminatorEntity[] = [];

    for (const { variants: variantsData, ...responseData } of data) {
      const response = await this.createOne({ ...responseData, createdByID: userID, updatedByID: userID }, { flush: false });

      const responseDiscriminator = await this.responseDiscriminator.createOne(
        {
          channel: Channel.DEFAULT,
          language: Language.ENGLISH_US,
          responseID: response.id,
          assistantID: response.assistant.id,
          variantOrder: [],
          environmentID: response.environmentID,
        },
        { flush: false }
      );

      const result = await this.responseVariant.createManyWithRefs(
        userID,
        variantsData.map((variantData) => ({
          ...variantData,
          assistantID: responseDiscriminator.assistant.id,
          environmentID: responseDiscriminator.environmentID,
          discriminatorID: responseDiscriminator.id,
        })),
        { flush: false }
      );

      responseDiscriminator.variantOrder = result.responseVariants.map((v) => v.id);

      prompts.push(...result.prompts);
      responses.push(response);
      responseVariants.push(...result.responseVariants);
      responseAttachments.push(...result.responseAttachments);
      responseDiscriminators.push(responseDiscriminator);
    }

    if (flush) {
      await this.orm.em.flush();
    }

    return {
      prompts,
      responses,
      responseVariants,
      responseAttachments,
      responseDiscriminators,
    };
  }

  async createManyAndSync(userID: number, data: ResponseCreateRefData[]) {
    const { prompts, responses, responseVariants, responseAttachments, responseDiscriminators } = await this.createManyWithRefs(userID, data, {
      flush: false,
    });

    await this.orm.em.flush();

    return {
      add: {
        prompts,
        responses,
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
        responses: ResponseEntity[];
        responseVariants: AnyResponseVariantEntity[];
        responseAttachments: AnyResponseAttachmentEntity[];
        responseDiscriminators: ResponseDiscriminatorEntity[];
      };
    }
  ) {
    await Promise.all([
      this.responseDiscriminator.broadcastAddMany(authMeta, {
        add: Utils.object.pick(add, ['prompts', 'responseVariants', 'responseAttachments', 'responseDiscriminators']),
      }),

      ...groupByAssistant(add.responses).map((responses) =>
        this.logux.processAs(
          Actions.Response.AddMany({
            data: this.entitySerializer.iterable(responses),
            context: broadcastContext(responses[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: ResponseCreateRefData[]) {
    const result = await this.createManyAndSync(authMeta.userID, data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.responses;
  }

  /* Delete */

  async collectRelationsToDelete(responses: PKOrEntity<ResponseEntity>[]) {
    const responseDiscriminators = await this.responseDiscriminator.findManyByResponses(responses);
    const relations = await this.responseDiscriminator.collectRelationsToDelete(responseDiscriminators);

    return {
      ...relations,
      responseDiscriminators,
    };
  }

  async syncRequiredEntitiesOnDelete(responses: PKOrEntity<ResponseEntity>[], { flush = true }: ORMMutateOptions = {}) {
    const requiredEntities = await this.requiredEntityORM.findManyByReprompts(responses);

    requiredEntities.forEach((requiredEntity) => {
      // eslint-disable-next-line no-param-reassign
      requiredEntity.reprompt = null;
    });

    if (flush) {
      await this.orm.em.flush();
    }

    return requiredEntities;
  }

  async deleteManyWithRelations(
    {
      responses,
      responseVariants,
      responseAttachments,
      responseDiscriminators,
    }: {
      responses: PKOrEntity<ResponseEntity>[];
      responseVariants: PKOrEntity<AnyResponseVariantEntity>[];
      responseAttachments: PKOrEntity<AnyResponseAttachmentEntity>[];
      responseDiscriminators: PKOrEntity<ResponseDiscriminatorEntity>[];
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    await Promise.all([
      this.responseDiscriminator.deleteManyWithRelations({ responseVariants, responseAttachments, responseDiscriminators }, { flush: false }),
      this.deleteMany(responses, { flush: false }),
    ]);

    if (flush) {
      await this.orm.em.flush();
    }
  }

  async deleteManyAndSync(ids: Primary<ResponseEntity>[]) {
    const responses = await this.findMany(ids);

    const [relations, requiredEntities] = await Promise.all([
      this.collectRelationsToDelete(responses),
      this.syncRequiredEntitiesOnDelete(responses, { flush: false }),
    ]);

    await this.deleteManyWithRelations({ ...relations, responses }, { flush: false });

    await this.orm.em.flush();

    return {
      sync: { requiredEntities },
      delete: { ...relations, responses },
    };
  }

  async broadcastSyncOnDelete(authMeta: AuthMetaPayload, { sync }: { sync: { requiredEntities: RequiredEntityEntity[] } }) {
    await Promise.all(
      groupByAssistant(sync.requiredEntities).map((requiredEntities) =>
        this.logux.processAs(
          Actions.RequiredEntity.PatchMany({
            ids: toEntityIDs(requiredEntities),
            patch: { repromptID: null },
            context: broadcastContext(requiredEntities[0]),
          }),
          authMeta
        )
      )
    );
  }

  async broadcastDeleteMany(
    authMeta: AuthMetaPayload,
    {
      sync,
      delete: del,
    }: {
      sync: { requiredEntities: RequiredEntityEntity[] };
      delete: {
        responses: ResponseEntity[];
        responseVariants: AnyResponseVariantEntity[];
        responseAttachments: AnyResponseAttachmentEntity[];
        responseDiscriminators: ResponseDiscriminatorEntity[];
      };
    }
  ) {
    await Promise.all([
      this.broadcastSyncOnDelete(authMeta, { sync }),

      ...groupByAssistant(del.responses).map((responses) =>
        this.logux.processAs(
          Actions.Response.DeleteMany({
            ids: toEntityIDs(responses),
            context: broadcastContext(responses[0]),
          }),
          authMeta
        )
      ),
      this.responseDiscriminator.broadcastDeleteMany(authMeta, {
        delete: Utils.object.pick(del, ['responseVariants', 'responseAttachments', 'responseDiscriminators']),
      }),
    ]);
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<ResponseEntity>[]): Promise<void> {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }
}
