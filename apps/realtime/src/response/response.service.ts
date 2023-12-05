/* eslint-disable no-await-in-loop */
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
  ToJSONWithForeignKeys,
} from '@voiceflow/orm-designer';
import { Channel, Language, RequiredEntityORM, ResponseORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { EntitySerializer, TabularService } from '@/common';
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';
import { deepSetCreatorID } from '@/utils/creator.util';
import { cloneManyEntities } from '@/utils/entity.util';

import { ResponseAnyAttachmentImportData, ResponseAnyVariantImportData, ResponseCreateWithSubResourcesData } from './response.interface';
import { ResponseAttachmentService } from './response-attachment/response-attachment.service';
import { ResponseDiscriminatorService } from './response-discriminator/response-discriminator.service';
import { ResponseVariantService } from './response-variant/response-variant.service';

@Injectable()
export class ResponseService extends TabularService<ResponseORM> {
  // eslint-disable-next-line max-params
  constructor(
    @Inject(ResponseORM)
    protected readonly orm: ResponseORM,
    @Inject(RequiredEntityORM)
    protected readonly requiredEntityORM: RequiredEntityORM,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(ResponseVariantService)
    private readonly responseVariant: ResponseVariantService,
    @Inject(ResponseAttachmentService)
    private readonly responseAttachment: ResponseAttachmentService,
    @Inject(ResponseDiscriminatorService)
    private readonly responseDiscriminator: ResponseDiscriminatorService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {
    super();
  }

  /* Find */

  async findManyWithSubResourcesByAssistant(assistantID: string, environmentID: string) {
    const [responses, responseVariants, responseAttachments, responseDiscriminators] = await Promise.all([
      this.findManyByAssistant(assistantID, environmentID),
      this.responseVariant.findManyByAssistant(assistantID, environmentID),
      this.responseAttachment.findManyByAssistant(assistantID, environmentID),
      this.responseDiscriminator.findManyByAssistant(assistantID, environmentID),
    ]);

    return {
      responses,
      responseVariants,
      responseAttachments,
      responseDiscriminators,
    };
  }

  /* Export */

  prepareExportData({
    responses,
    responseVariants,
    responseAttachments,
    responseDiscriminators,
  }: {
    responses: ResponseEntity[];
    responseVariants: AnyResponseVariantEntity[];
    responseAttachments: AnyResponseAttachmentEntity[];
    responseDiscriminators: ResponseDiscriminatorEntity[];
  }) {
    return {
      responses: this.entitySerializer.iterable(responses),
      responseVariants: this.entitySerializer.iterable(responseVariants),
      responseAttachments: this.entitySerializer.iterable(responseAttachments),
      responseDiscriminators: this.entitySerializer.iterable(responseDiscriminators),
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
    const [
      {
        responses: sourceResponses,
        responseVariants: sourceResponseVariants,
        responseAttachments: sourceResponseAttachments,
        responseDiscriminators: sourceResponseDiscriminators,
      },
      targetResponses,
    ] = await Promise.all([
      this.findManyWithSubResourcesByAssistant(assistantID, sourceEnvironmentID),
      this.findManyByAssistant(assistantID, targetEnvironmentID),
    ]);

    await this.deleteMany(targetResponses, { flush: false });

    const result = await this.importManyWithSubResources(
      {
        responses: cloneManyEntities(sourceResponses, { environmentID: targetEnvironmentID }),
        responseVariants: cloneManyEntities(sourceResponseVariants, { environmentID: targetEnvironmentID }),
        responseAttachments: cloneManyEntities(sourceResponseAttachments, { environmentID: targetEnvironmentID }),
        responseDiscriminators: cloneManyEntities(sourceResponseDiscriminators, { environmentID: targetEnvironmentID }),
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
    {
      responses,
      responseVariants,
      responseAttachments,
      responseDiscriminators,
    }: {
      responses: ToJSONWithForeignKeys<ResponseEntity>[];
      responseVariants: ResponseAnyVariantImportData[];
      responseAttachments: ResponseAnyAttachmentImportData[];
      responseDiscriminators: ToJSONWithForeignKeys<ResponseDiscriminatorEntity>[];
    },
    { userID, backup, assistantID, environmentID }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ) {
    const createdAt = new Date().toJSON();

    return {
      responses: responses.map<ToJSONWithForeignKeys<ResponseEntity>>((item) =>
        backup
          ? { ...item, assistantID, environmentID }
          : { ...deepSetCreatorID(item, userID), createdAt, updatedAt: createdAt, assistantID, environmentID }
      ),

      responseVariants: responseVariants.map<ResponseAnyVariantImportData>((item) =>
        backup
          ? { ...item, assistantID, environmentID }
          : { ...deepSetCreatorID(item, userID), createdAt, updatedAt: createdAt, assistantID, environmentID }
      ),

      responseAttachments: responseAttachments.map<ResponseAnyAttachmentImportData>((item) =>
        backup ? { ...item, assistantID, environmentID } : { ...deepSetCreatorID(item, userID), createdAt, assistantID, environmentID }
      ),

      responseDiscriminators: responseDiscriminators.map<ToJSONWithForeignKeys<ResponseDiscriminatorEntity>>((item) =>
        backup
          ? { ...item, assistantID, environmentID }
          : { ...deepSetCreatorID(item, userID), createdAt, updatedAt: createdAt, assistantID, environmentID }
      ),
    };
  }

  async importManyWithSubResources(
    data: {
      responses: ToJSONWithForeignKeys<ResponseEntity>[];
      responseVariants: ResponseAnyVariantImportData[];
      responseAttachments: ResponseAnyAttachmentImportData[];
      responseDiscriminators: ToJSONWithForeignKeys<ResponseDiscriminatorEntity>[];
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    const [responses, responseDiscriminators, responseVariants, responseAttachments] = await Promise.all([
      this.createMany(data.responses, { flush: false }),
      this.responseDiscriminator.createMany(data.responseDiscriminators, { flush: false }),
      this.responseVariant.createMany(data.responseVariants, { flush: false }),
      this.responseAttachment.createMany(data.responseAttachments, { flush: false }),
    ]);

    if (flush) {
      await this.orm.em.flush();
    }

    return {
      responses,
      responseVariants,
      responseAttachments,
      responseDiscriminators,
    };
  }

  /* Create */

  async createManyWithSubResources(userID: number, data: ResponseCreateWithSubResourcesData[], { flush = true }: ORMMutateOptions = {}) {
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

      const result = await this.responseVariant.createManyWithSubResources(
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

  async createManyAndSync(userID: number, data: ResponseCreateWithSubResourcesData[]) {
    const { prompts, responses, responseVariants, responseAttachments, responseDiscriminators } = await this.createManyWithSubResources(
      userID,
      data,
      {
        flush: false,
      }
    );

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
            context: assistantBroadcastContext(responses[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: ResponseCreateWithSubResourcesData[]) {
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

  async deleteManyAndSync(ids: Primary<ResponseEntity>[]) {
    const responses = await this.findMany(ids);

    const [relations, requiredEntities] = await Promise.all([
      this.collectRelationsToDelete(responses),
      this.syncRequiredEntitiesOnDelete(responses, { flush: false }),
    ]);

    await this.deleteMany(responses, { flush: false });

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
            context: assistantBroadcastContext(requiredEntities[0]),
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
            context: assistantBroadcastContext(responses[0]),
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
