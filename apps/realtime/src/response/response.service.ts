/* eslint-disable max-params */

import type { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { AnyResponseAttachment, AnyResponseVariant, Channel, Language, Response, ResponseDiscriminator } from '@voiceflow/dtos';
import { LoguxService } from '@voiceflow/nestjs-logux';
import type {
  AnyResponseAttachmentJSON,
  AnyResponseAttachmentObject,
  AnyResponseVariantJSON,
  AnyResponseVariantObject,
  RequiredEntityObject,
  ResponseDiscriminatorJSON,
  ResponseDiscriminatorObject,
  ResponseJSON,
  ResponseObject,
} from '@voiceflow/orm-designer';
import { DatabaseTarget, ObjectId, RequiredEntityORM, ResponseORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';
import _ from 'lodash';

import { CMSTabularService } from '@/common';
import { cmsBroadcastContext, toPostgresEntityIDs } from '@/common/utils';
import { CMSBroadcastMeta, CMSContext } from '@/types';

import { ResponseExportImportDataDTO } from './dtos/response-export-import-data.dto';
import {
  DuplicateAttachment,
  DuplicateDiscriminator,
  DuplicateResponse,
  DuplicateVariant,
  OMIT_DUPLICATE_ATTACHMENT,
  OMIT_DUPLICATE_DISCRIMINATOR,
  OMIT_DUPLICATE_RESPONSE,
  OMIT_DUPLICATE_VARIANTS,
  ResponseCreateWithSubResourcesData,
} from './response.interface';
import { ResponseAttachmentService } from './response-attachment/response-attachment.service';
import { ResponseDiscriminatorService } from './response-discriminator/response-discriminator.service';
import { ResponseVariantService } from './response-variant/response-variant.service';

@Injectable()
export class ResponseService extends CMSTabularService<ResponseORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

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
    private readonly responseDiscriminator: ResponseDiscriminatorService
  ) {
    super();
  }

  /* Find */

  async findManyWithSubResourcesByEnvironment(environmentID: string) {
    const [responses, responseVariants, responseAttachments, responseDiscriminators] = await Promise.all([
      this.orm.findManyByEnvironment(environmentID),
      this.responseVariant.findManyByEnvironment(environmentID),
      this.responseAttachment.findManyByEnvironment(environmentID),
      this.responseDiscriminator.findManyByEnvironment(environmentID),
    ]);

    return {
      responses,
      responseVariants,
      responseAttachments,
      responseDiscriminators,
    };
  }

  /* Export */

  toJSONWithSubResources({
    responses,
    responseVariants,
    responseAttachments,
    responseDiscriminators,
  }: {
    responses: ResponseObject[];
    responseVariants: AnyResponseVariantObject[];
    responseAttachments: AnyResponseAttachmentObject[];
    responseDiscriminators: ResponseDiscriminatorObject[];
  }) {
    return {
      responses: this.mapToJSON(responses),
      responseVariants: this.responseVariant.mapToJSON(responseVariants),
      responseAttachments: this.responseAttachment.mapToJSON(responseAttachments),
      responseDiscriminators: this.responseDiscriminator.mapToJSON(responseDiscriminators),
    };
  }

  fromJSONWithSubResources({ responses, responseVariants, responseAttachments, responseDiscriminators }: ResponseExportImportDataDTO) {
    return {
      responses: this.mapFromJSON(responses),
      responseVariants: this.responseVariant.mapFromJSON(responseVariants),
      responseAttachments: this.responseAttachment.mapFromJSON(responseAttachments),
      responseDiscriminators: this.responseDiscriminator.mapFromJSON(responseDiscriminators),
    };
  }

  prepareExportData(
    data: {
      responses: ResponseObject[];
      responseVariants: AnyResponseVariantObject[];
      responseAttachments: AnyResponseAttachmentObject[];
      responseDiscriminators: ResponseDiscriminatorObject[];
    },
    { backup }: { backup?: boolean } = {}
  ): ResponseExportImportDataDTO {
    const json = this.toJSONWithSubResources(data);

    if (backup) {
      return json;
    }

    return {
      responses: json.responses.map((item) => Utils.object.omit(item, ['assistantID', 'environmentID'])),
      responseVariants: json.responseVariants.map((item) =>
        Utils.object.omit(item, ['updatedAt', 'updatedByID', 'assistantID', 'environmentID'])
      ) as ResponseExportImportDataDTO['responseVariants'],
      responseAttachments: json.responseAttachments.map((item) =>
        Utils.object.omit(item, ['assistantID', 'environmentID'])
      ) as ResponseExportImportDataDTO['responseAttachments'],
      responseDiscriminators: json.responseDiscriminators.map((item) =>
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
    const {
      responses: sourceResponses,
      responseVariants: sourceResponseVariants,
      responseAttachments: sourceResponseAttachments,
      responseDiscriminators: sourceResponseDiscriminators,
    } = await this.findManyWithSubResourcesByEnvironment(sourceEnvironmentID);

    return this.importManyWithSubResources({
      responses: sourceResponses.map((item) => ({ ...item, assistantID: targetAssistantID, environmentID: targetEnvironmentID })),
      responseVariants: sourceResponseVariants.map((item) => ({ ...item, assistantID: targetAssistantID, environmentID: targetEnvironmentID })),
      responseAttachments: sourceResponseAttachments.map((item) => ({
        ...item,
        assistantID: targetAssistantID,
        environmentID: targetEnvironmentID,
      })),
      responseDiscriminators: sourceResponseDiscriminators.map((item) => ({
        ...item,
        assistantID: targetAssistantID,
        environmentID: targetEnvironmentID,
      })),
    });
  }

  /* Import */

  prepareImportData(
    { responses, responseVariants, responseAttachments, responseDiscriminators }: ResponseExportImportDataDTO,
    { userID, backup, assistantID, environmentID }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ): {
    responses: ResponseJSON[];
    responseVariants: AnyResponseVariantJSON[];
    responseAttachments: AnyResponseAttachmentJSON[];
    responseDiscriminators: ResponseDiscriminatorJSON[];
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

  async importManyWithSubResources(data: {
    responses: ResponseObject[];
    responseVariants: AnyResponseVariantObject[];
    responseAttachments: AnyResponseAttachmentObject[];
    responseDiscriminators: ResponseDiscriminatorObject[];
  }) {
    // ORDER MATTERS
    const responses = await this.createMany(data.responses);
    const responseDiscriminators = await this.responseDiscriminator.createMany(data.responseDiscriminators);
    const responseVariants = await this.responseVariant.createMany(data.responseVariants);
    const responseAttachments = await this.responseAttachment.createMany(data.responseAttachments);

    return {
      responses,
      responseVariants,
      responseAttachments,
      responseDiscriminators,
    };
  }

  async importManyWithSubResourcesFromJSON({
    responses,
    responseVariants,
    responseAttachments,
    responseDiscriminators,
  }: ResponseExportImportDataDTO) {
    await this.importManyWithSubResources(
      this.fromJSONWithSubResources({
        responses,
        responseVariants: responseVariants ?? [],
        responseAttachments: responseAttachments ?? [],
        responseDiscriminators: responseDiscriminators ?? [],
      })
    );
  }

  /* Create */

  async createManyWithSubResources(data: ResponseCreateWithSubResourcesData[], { userID, context }: { userID: number; context: CMSContext }) {
    const dataWithIDs = data.map(({ id, variants, ...data }) => {
      const responseID = id ?? new ObjectId().toJSON();
      const discriminatorID = new ObjectId().toJSON();

      const variantsWithIDs = variants.map((variant) => ({
        ...variant,
        id: variant.id ?? new ObjectId().toJSON(),
        assistantID: context.assistantID,
        environmentID: context.environmentID,
        discriminatorID,
      }));

      return {
        ...data,
        id: responseID,
        variants: variantsWithIDs,
        assistantID: context.assistantID,
        environmentID: context.environmentID,
        discriminator: {
          id: discriminatorID,
          channel: Channel.DEFAULT,
          language: Language.ENGLISH_US,
          responseID,
          assistantID: context.assistantID,
          variantOrder: toPostgresEntityIDs(variantsWithIDs),
          environmentID: context.environmentID,
        },
      };
    });

    const responses = await this.createManyForUser(
      userID,
      dataWithIDs.map((data) => Utils.object.omit(data, ['variants', 'discriminator']))
    );

    const responseDiscriminators = await this.responseDiscriminator.createManyForUser(
      userID,
      dataWithIDs.map((data) => data.discriminator)
    );

    const responseVariantsWithSubResources = await this.responseVariant.createManyWithSubResources(
      dataWithIDs.flatMap((data) => data.variants),
      { userID, context }
    );

    return {
      ...responseVariantsWithSubResources,
      responses,
      responseDiscriminators,
    };
  }

  async createManyAndSync(data: ResponseCreateWithSubResourcesData[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const result = await this.createManyWithSubResources(data, { userID, context });

      return {
        add: result,
      };
    });
  }

  async broadcastAddMany(
    {
      add,
    }: {
      add: {
        responses: ResponseObject[];
        responseVariants: AnyResponseVariantObject[];
        responseAttachments: AnyResponseAttachmentObject[];
        responseDiscriminators: ResponseDiscriminatorObject[];
      };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.responseDiscriminator.broadcastAddMany(
        {
          add: Utils.object.pick(add, ['responseVariants', 'responseAttachments', 'responseDiscriminators']),
        },
        meta
      ),

      this.logux.processAs(
        Actions.Response.AddMany({
          data: this.mapToJSON(add.responses),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }

  async createManyAndBroadcast(data: ResponseCreateWithSubResourcesData[], meta: CMSBroadcastMeta) {
    const result = await this.createManyAndSync(data, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastAddMany(result, meta);

    return result.add.responses;
  }

  /* Duplicate */
  duplicateManyAndSync(responseIDs: string[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      // Fetch responses and their discriminators
      const [sourceResponses, sourceDiscriminators] = await Promise.all([
        this.findManyByEnvironmentAndIDs(context.environmentID, responseIDs),
        this.responseDiscriminator.findManyByResponses(context.environmentID, responseIDs),
      ]);

      const discriminatorIDs = sourceDiscriminators.map((d) => d.id);
      const sourceVariants = await this.responseVariant.findManyByDiscriminators(context.environmentID, discriminatorIDs);

      const variantIDs = sourceVariants.map((v) => v.id);
      const sourceAttachments = await this.responseAttachment.findManyByVariants(context.environmentID, variantIDs);

      // Group discriminators by response ID
      const sourceDiscriminatorsByResponseID = _.groupBy(sourceDiscriminators, (item) => item.responseID);
      const sourceVariantsByDiscriminatorID = _.groupBy(sourceVariants, (item) => item.discriminatorID);
      const sourceAttachmentsByVariantID = _.groupBy(sourceAttachments, (item) => item.variantID);

      const newResponsesData: Array<DuplicateResponse> = [];
      const newDiscriminatorsData: Array<DuplicateDiscriminator> = [];
      const newVariantsData: Array<DuplicateVariant> = [];
      const newAttachmentsData: Array<DuplicateAttachment> = [];

      sourceResponses.forEach((response) => {
        const newResponse = {
          ...Utils.object.omit(response, [...OMIT_DUPLICATE_RESPONSE]),
          id: new ObjectId().toJSON(),
          assistantID: context.assistantID,
          environmentID: context.environmentID,
        };

        sourceDiscriminatorsByResponseID[response.id]?.forEach((discriminator) => {
          const variantIDRemap: Record<string, string> = {};

          const newDiscriminator = {
            ...Utils.object.omit(discriminator, [...OMIT_DUPLICATE_DISCRIMINATOR]),
            id: new ObjectId().toJSON(),
            responseID: newResponse.id,
            assistantID: context.assistantID,
            variantOrder: [],
            environmentID: context.environmentID,
          };

          sourceVariantsByDiscriminatorID[discriminator.id]?.forEach((variant) => {
            const newVariantID = new ObjectId().toJSON();
            const attachmentIDRemap: Record<string, string> = {};

            variantIDRemap[variant.id] = newVariantID;

            const newVariant = {
              ...Utils.object.omit(variant, [...OMIT_DUPLICATE_VARIANTS]),
              id: newVariantID,
              assistantID: context.assistantID,
              environmentID: context.environmentID,
              attachmentOrder: [],
              discriminatorID: newDiscriminator.id,
            };

            sourceAttachmentsByVariantID[variant.id]?.forEach((attachment) => {
              const newAttachmentID = new ObjectId().toJSON();

              attachmentIDRemap[attachment.id] = newAttachmentID;

              const newAttachment = {
                ...Utils.object.omit(attachment, [...OMIT_DUPLICATE_ATTACHMENT]),
                id: newAttachmentID,
                variantID: newVariant.id,
                assistantID: context.assistantID,
                environmentID: context.environmentID,
              };

              newAttachmentsData.push(newAttachment);
            });

            newVariantsData.push({
              ...newVariant,
              attachmentOrder: variant.attachmentOrder.map((id) => attachmentIDRemap[id]).filter(Boolean),
            });
          });

          newDiscriminatorsData.push({
            ...newDiscriminator,
            variantOrder: discriminator.variantOrder.map((id) => variantIDRemap[id]).filter(Boolean),
          });
        });

        newResponsesData.push(newResponse);
      });

      // ORDER MATTERS
      const responses = await this.createManyForUser(userID, newResponsesData);
      const responseDiscriminators = await this.responseDiscriminator.createManyForUser(userID, newDiscriminatorsData);
      const responseVariants = await this.responseVariant.createMany(newVariantsData as any);
      const responseAttachments = await this.responseAttachment.createMany(newAttachmentsData as any);

      return {
        add: {
          responses,
          responseDiscriminators,
          responseVariants,
          responseAttachments,
        },
      };
    });
  }

  async duplicateManyAndBroadcast(responseIDs: string[], meta: CMSBroadcastMeta) {
    const result = await this.duplicateManyAndSync(responseIDs, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastAddMany(result, meta);

    return result.add.responses;
  }

  /* Delete */

  async collectRelationsToDelete(environmentID: string, responseIDs: string[]) {
    const responseDiscriminators = await this.responseDiscriminator.findManyByResponses(environmentID, responseIDs);
    const relations = await this.responseDiscriminator.collectRelationsToDelete(environmentID, toPostgresEntityIDs(responseDiscriminators));

    return {
      ...relations,
      responseDiscriminators,
    };
  }

  async syncRequiredEntitiesOnDelete(ids: string[], { userID, context }: { userID: number; context: CMSContext }) {
    const requiredEntities = await this.requiredEntityORM.findManyByReprompts(context.environmentID, ids);

    await this.requiredEntityORM.patchManyForUser(
      userID,
      requiredEntities.map(({ id, environmentID }) => ({ id, environmentID })),
      { repromptID: null }
    );

    return requiredEntities.map((item) => ({ ...item, repromptID: null }));
  }

  async deleteManyAndSync(ids: string[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const responses = await this.findManyByEnvironmentAndIDs(context.environmentID, ids);

      const [relations, requiredEntities] = await Promise.all([
        this.collectRelationsToDelete(context.environmentID, ids),
        this.syncRequiredEntitiesOnDelete(ids, { userID, context }),
      ]);

      await this.deleteManyByEnvironmentAndIDs(context.environmentID, ids);

      return {
        sync: { requiredEntities },
        delete: { ...relations, responses },
      };
    });
  }

  async broadcastSyncOnDelete({ sync }: { sync: { requiredEntities: RequiredEntityObject[] } }, meta: CMSBroadcastMeta) {
    await this.logux.processAs(
      Actions.RequiredEntity.PatchMany({
        ids: toPostgresEntityIDs(sync.requiredEntities),
        patch: { repromptID: null },
        context: cmsBroadcastContext(meta.context),
      }),
      meta.auth
    );
  }

  async broadcastDeleteMany(
    {
      sync,
      delete: del,
    }: {
      sync: { requiredEntities: RequiredEntityObject[] };
      delete: {
        responses: ResponseObject[];
        responseVariants: AnyResponseVariantObject[];
        responseAttachments: AnyResponseAttachmentObject[];
        responseDiscriminators: ResponseDiscriminatorObject[];
      };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.broadcastSyncOnDelete({ sync }, meta),

      this.logux.processAs(
        Actions.Response.DeleteMany({
          ids: toPostgresEntityIDs(del.responses),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),

      this.responseDiscriminator.broadcastDeleteMany(
        { delete: Utils.object.pick(del, ['responseVariants', 'responseAttachments', 'responseDiscriminators']) },
        meta
      ),
    ]);
  }

  async deleteManyAndBroadcast(ids: string[], meta: CMSBroadcastMeta): Promise<void> {
    const result = await this.deleteManyAndSync(ids, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastDeleteMany(result, meta);
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

    await this.upsertMany(this.mapFromJSON(responses));
    await this.responseDiscriminator.upsertMany(this.responseDiscriminator.mapFromJSON(responseDiscriminators));
    await this.responseVariant.upsertMany(this.responseVariant.mapFromJSON(responseVariants));
    await this.responseAttachment.upsertMany(this.responseAttachment.mapFromJSON(responseAttachments));
  }
}
