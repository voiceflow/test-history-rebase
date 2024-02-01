/* eslint-disable max-params */
/* eslint-disable no-await-in-loop */
import type { EntityManager } from '@mikro-orm/core';
import { Primary } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { AnyResponseAttachment, AnyResponseVariant, Response, ResponseDiscriminator } from '@voiceflow/dtos';
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
import { Channel, DatabaseTarget, Language, RequiredEntityORM, ResponseORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSTabularService, EntitySerializer } from '@/common';
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';
import { cloneManyEntities } from '@/utils/entity.util';

import { ResponseExportImportDataDTO } from './dtos/response-export-import-data.dto';
import { ResponseAnyAttachmentImportData, ResponseAnyVariantImportData, ResponseCreateWithSubResourcesData } from './response.interface';
import { ResponseAttachmentService } from './response-attachment/response-attachment.service';
import { ResponseDiscriminatorService } from './response-discriminator/response-discriminator.service';
import { ResponseVariantService } from './response-variant/response-variant.service';

@Injectable()
export class ResponseService extends CMSTabularService<ResponseORM> {
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
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

  async findManyWithSubResourcesByEnvironment(assistantID: string, environmentID: string) {
    const [responses, responseVariants, responseAttachments, responseDiscriminators] = await Promise.all([
      this.findManyByEnvironment(assistantID, environmentID),
      this.responseVariant.findManyByEnvironment(assistantID, environmentID),
      this.responseAttachment.findManyByEnvironment(assistantID, environmentID),
      this.responseDiscriminator.findManyByEnvironment(assistantID, environmentID),
    ]);

    return {
      responses,
      responseVariants,
      responseAttachments,
      responseDiscriminators,
    };
  }

  /* Export */

  prepareExportData(
    {
      responses,
      responseVariants,
      responseAttachments,
      responseDiscriminators,
    }: {
      responses: ResponseEntity[];
      responseVariants: AnyResponseVariantEntity[];
      responseAttachments: AnyResponseAttachmentEntity[];
      responseDiscriminators: ResponseDiscriminatorEntity[];
    },
    { backup }: { backup?: boolean } = {}
  ): ResponseExportImportDataDTO {
    if (backup) {
      return {
        responses: this.entitySerializer.iterable(responses),
        responseVariants: this.entitySerializer.iterable(responseVariants),
        responseAttachments: this.entitySerializer.iterable(responseAttachments),
        responseDiscriminators: this.entitySerializer.iterable(responseDiscriminators),
      };
    }

    return {
      responses: this.entitySerializer.iterable(responses, { omit: ['assistantID', 'environmentID'] }),
      responseVariants: this.entitySerializer.iterable(responseVariants, {
        omit: ['updatedAt', 'updatedByID', 'assistantID', 'environmentID'],
      }) as ResponseExportImportDataDTO['responseVariants'],
      responseAttachments: this.entitySerializer.iterable(responseAttachments, {
        omit: ['assistantID', 'environmentID'],
      }) as ResponseExportImportDataDTO['responseAttachments'],
      responseDiscriminators: this.entitySerializer.iterable(responseDiscriminators, {
        omit: ['updatedAt', 'updatedByID', 'assistantID', 'environmentID'],
      }),
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
      responses: sourceResponses,
      responseVariants: sourceResponseVariants,
      responseAttachments: sourceResponseAttachments,
      responseDiscriminators: sourceResponseDiscriminators,
    } = await this.findManyWithSubResourcesByEnvironment(sourceAssistantID, sourceEnvironmentID);

    const result = await this.importManyWithSubResources(
      {
        responses: cloneManyEntities(sourceResponses, { assistantID: targetAssistantID, environmentID: targetEnvironmentID }),
        responseVariants: cloneManyEntities(sourceResponseVariants, { assistantID: targetAssistantID, environmentID: targetEnvironmentID }),
        responseAttachments: cloneManyEntities(sourceResponseAttachments, { assistantID: targetAssistantID, environmentID: targetEnvironmentID }),
        responseDiscriminators: cloneManyEntities(sourceResponseDiscriminators, {
          assistantID: targetAssistantID,
          environmentID: targetEnvironmentID,
        }),
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
    { responses, responseVariants, responseAttachments, responseDiscriminators }: ResponseExportImportDataDTO,
    { userID, backup, assistantID, environmentID }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ): {
    responses: ToJSONWithForeignKeys<ResponseEntity>[];
    responseVariants: ResponseAnyVariantImportData[];
    responseAttachments: ResponseAnyAttachmentImportData[];
    responseDiscriminators: ToJSONWithForeignKeys<ResponseDiscriminatorEntity>[];
  } {
    const createdAt = new Date().toJSON();

    if (backup) {
      return {
        responses: responses.map((item) => ({
          ...item,
          assistantID,
          environmentID,
        })),

        responseVariants: responseVariants.map((item) => ({
          ...item,
          updatedAt: item.updatedAt ?? createdAt,
          updatedByID: item.updatedByID ?? userID,
          assistantID,
          environmentID,
        })),

        responseAttachments: responseAttachments.map((item) => ({
          ...item,
          assistantID,
          environmentID,
        })),

        responseDiscriminators: responseDiscriminators.map((item) => ({
          ...item,
          updatedAt: item.updatedAt ?? createdAt,
          updatedByID: item.updatedByID ?? userID,
          assistantID,
          environmentID,
        })),
      };
    }

    return {
      responses: responses.map((item) => ({
        ...item,
        createdAt,
        updatedAt: createdAt,
        createdByID: userID,
        updatedByID: userID,
        assistantID,
        environmentID,
      })),

      responseVariants: responseVariants.map((item) => ({
        ...item,
        createdAt,
        updatedAt: createdAt,
        updatedByID: userID,
        assistantID,
        environmentID,
      })),

      responseAttachments: responseAttachments.map((item) => ({
        ...item,
        createdAt,
        assistantID,
        environmentID,
      })),

      responseDiscriminators: responseDiscriminators.map((item) => ({
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

      const responseDiscriminator = await this.responseDiscriminator.createOneForUser(
        userID,
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
    return this.postgresEM.transactional(async () => {
      const result = await this.createManyWithSubResources(userID, data, { flush: false });

      await this.orm.em.flush();

      return {
        add: result,
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
    return this.postgresEM.transactional(async () => {
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
    });
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

  /* Upsert */

  async upsertManyWithSubResources(
    data: {
      responses: Response[];
      responseVariants: AnyResponseVariant[];
      responseAttachments: AnyResponseAttachment[];
      responseDiscriminators: ResponseDiscriminator[];
    },
    meta: { userID: number; assistantID: string; environmentID: string }
  ) {
    const { responses, responseVariants, responseAttachments, responseDiscriminators } = this.prepareImportData(data, meta);

    await this.upsertMany(responses);
    await this.responseDiscriminator.upsertMany(responseDiscriminators);
    await this.responseVariant.upsertMany(responseVariants);
    await this.responseAttachment.upsertMany(responseAttachments);
  }
}
