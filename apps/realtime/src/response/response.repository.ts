import type { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { Channel, Language } from '@voiceflow/dtos';
import type {
  AnyResponseAttachmentObject,
  AnyResponseVariantObject,
  ResponseDiscriminatorObject,
  ResponseMessageObject,
  ResponseObject,
} from '@voiceflow/orm-designer';
import { DatabaseTarget, ObjectId, RequiredEntityORM, ResponseORM } from '@voiceflow/orm-designer';

import { CMSTabularService } from '@/common';
import { toPostgresEntityIDs } from '@/common/utils';
import { ReferenceService } from '@/reference/reference.service';
import type { CMSContext } from '@/types';

import type { ResponseExportImportDataDTO } from './dtos/response-export-import-data.dto';
import type { ResponseCreateWithSubResourcesData } from './response.interface';
import { ResponseAttachmentService } from './response-attachment/response-attachment.service';
import { ResponseDiscriminatorService } from './response-discriminator/response-discriminator.service';
import { ResponseMessageRepository } from './response-message/response-message.repository';
import { ResponseVariantService } from './response-variant/response-variant.service';

@Injectable()
export class ResponseRepository extends CMSTabularService<ResponseORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  // eslint-disable-next-line max-params
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(ResponseORM)
    protected readonly orm: ResponseORM,
    @Inject(ResponseMessageRepository)
    private readonly responseMessage: ResponseMessageRepository,
    @Inject(ResponseVariantService)
    private readonly responseVariant: ResponseVariantService,
    @Inject(ResponseAttachmentService)
    private readonly responseAttachment: ResponseAttachmentService,
    @Inject(ResponseDiscriminatorService)
    private readonly responseDiscriminator: ResponseDiscriminatorService,
    @Inject(RequiredEntityORM)
    protected readonly requiredEntityORM: RequiredEntityORM,
    @Inject(ReferenceService)
    private referenceService: ReferenceService
  ) {
    super();
  }

  async findManyWithSubResourcesByEnvironment(environmentID: string) {
    const [responses, responseVariants, responseAttachments, responseDiscriminators, responseMessages] =
      await Promise.all([
        this.orm.findManyByEnvironment(environmentID),
        this.responseVariant.findManyByEnvironment(environmentID),
        this.responseAttachment.findManyByEnvironment(environmentID),
        this.responseDiscriminator.findManyByEnvironment(environmentID),
        this.responseMessage.findManyByEnvironment(environmentID),
      ]);

    return {
      responses,
      responseVariants,
      responseAttachments,
      responseDiscriminators,
      responseMessages,
    };
  }

  async createManyResponses(
    data: ResponseCreateWithSubResourcesData[],
    { userID, context }: { userID: number; context: CMSContext }
  ) {
    return this.postgresEM.transactional(async () => {
      const dataWithIDs = data.map(({ id, variants = [], messages = [], ...data }) => {
        const responseID = id ?? new ObjectId().toJSON();
        const discriminatorID = new ObjectId().toJSON();

        const variantsWithIDs = variants.map((variant) => ({
          ...variant,
          id: variant.id ?? new ObjectId().toJSON(),
          assistantID: context.assistantID,
          environmentID: context.environmentID,
          discriminatorID,
        }));

        const messagesWithIDs = messages.map((message) => ({
          ...message,
          id: message.id ?? new ObjectId().toJSON(),
          assistantID: context.assistantID,
          environmentID: context.environmentID,
          discriminatorID,
        }));

        const variantOrder = messagesWithIDs.length
          ? toPostgresEntityIDs(messagesWithIDs)
          : toPostgresEntityIDs(variantsWithIDs);

        return {
          ...data,
          id: responseID,
          variants: variantsWithIDs,
          messages: messagesWithIDs,
          assistantID: context.assistantID,
          environmentID: context.environmentID,
          discriminator: {
            id: discriminatorID,
            channel: Channel.DEFAULT,
            language: Language.ENGLISH_US,
            responseID,
            assistantID: context.assistantID,
            variantOrder,
            environmentID: context.environmentID,
          },
        };
      });

      const responses = await this.createManyForUser(
        userID,
        dataWithIDs.map((data) => Utils.object.omit(data, ['variants', 'messages', 'discriminator']))
      );

      const responseDiscriminators = await this.responseDiscriminator.createManyForUser(
        userID,
        dataWithIDs.map((data) => data.discriminator)
      );

      const responseVariantsWithSubResources = await this.responseVariant.createManyWithSubResources(
        dataWithIDs.flatMap((data) => data.variants),
        { userID, context }
      );

      const result = {
        ...responseVariantsWithSubResources,
        responses,
        responseDiscriminators,
      };

      const messages = dataWithIDs.flatMap((data) => data.messages);

      if (messages.length) {
        const responseMessages = await this.responseMessage.createManyWithSubResources(
          userID,
          messages.map(({ condition: _, ...data }) => data)
        );
        return { ...result, responseMessages };
      }

      return result;
    });
  }

  async deleteManyResponsesAndRelations(ids: string[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const responses = await this.findManyByEnvironmentAndIDs(context.environmentID, ids);

      const [relations, requiredEntities, references] = await Promise.all([
        this.collectRelationsToDelete(context.environmentID, ids),
        this.removeRepromptsReferences(userID, context.environmentID, ids),
        this.referenceService.deleteManyWithSubResourcesByResponseIDs({
          assistantID: context.assistantID,
          environmentID: context.environmentID,
          userID,
          responseIDs: responses.map((r) => r.id),
        }),
      ]);

      await this.deleteManyByEnvironmentAndIDs(context.environmentID, ids);

      return {
        ...relations,
        requiredEntities,
        responses,
        references,
      };
    });
  }

  async collectRelationsToDelete(environmentID: string, responseIDs: string[]) {
    const responseDiscriminators = await this.responseDiscriminator.findManyByResponses(environmentID, responseIDs);
    const relations = await this.responseDiscriminator.collectRelationsToDelete(
      environmentID,
      toPostgresEntityIDs(responseDiscriminators)
    );

    return {
      ...relations,
      responseDiscriminators,
    };
  }

  toJSONWithSubResources({
    responses,
    responseVariants,
    responseAttachments,
    responseDiscriminators,
    responseMessages,
  }: {
    responses: ResponseObject[];
    responseVariants: AnyResponseVariantObject[];
    responseAttachments: AnyResponseAttachmentObject[];
    responseDiscriminators: ResponseDiscriminatorObject[];
    responseMessages?: ResponseMessageObject[];
  }) {
    return {
      responses: this.mapToJSON(responses),
      responseVariants: this.responseVariant.mapToJSON(responseVariants),
      responseAttachments: this.responseAttachment.mapToJSON(responseAttachments),
      responseDiscriminators: this.responseDiscriminator.mapToJSON(responseDiscriminators),
      responseMessages: this.responseMessage.mapToJSON(responseMessages || []),
    };
  }

  fromJSONWithSubResources({
    responses,
    responseVariants,
    responseAttachments,
    responseDiscriminators,
    responseMessages = [],
  }: ResponseExportImportDataDTO) {
    return {
      responses: this.mapFromJSON(responses),
      responseVariants: this.responseVariant.mapFromJSON(responseVariants),
      responseAttachments: this.responseAttachment.mapFromJSON(responseAttachments),
      responseDiscriminators: this.responseDiscriminator.mapFromJSON(responseDiscriminators),
      responseMessages: this.responseMessage.mapFromJSON(responseMessages) || [],
    };
  }

  async removeRepromptsReferences(userID: number, environmentID: string, responseIDs: string[]) {
    const requiredEntities = await this.requiredEntityORM.findManyByReprompts(environmentID, responseIDs);

    await this.requiredEntityORM.patchManyForUser(
      userID,
      requiredEntities.map(({ id, environmentID }) => ({ id, environmentID })),
      { repromptID: null }
    );

    return requiredEntities.map((item) => ({ ...item, repromptID: null }));
  }
}
