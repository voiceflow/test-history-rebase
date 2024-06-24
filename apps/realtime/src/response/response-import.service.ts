import { Inject, Injectable } from '@nestjs/common';
import {
  AnyResponseAttachmentJSON,
  AnyResponseAttachmentObject,
  AnyResponseVariantJSON,
  AnyResponseVariantObject,
  ResponseDiscriminatorJSON,
  ResponseDiscriminatorObject,
  ResponseJSON,
  ResponseMessageJSON,
  ResponseMessageObject,
  ResponseObject,
} from '@voiceflow/orm-designer';

import { ResponseExportImportDataDTO } from './dtos/response-export-import-data.dto';
import { ResponseRepository } from './response.repository';
import { ResponseAttachmentService } from './response-attachment/response-attachment.service';
import { ResponseDiscriminatorService } from './response-discriminator/response-discriminator.service';
import { ResponseMessageRepository } from './response-message/response-message.repository';
import { ResponseVariantService } from './response-variant/response-variant.service';

@Injectable()
export class ResponseImportService {
  constructor(
    @Inject(ResponseRepository)
    private readonly repository: ResponseRepository,
    @Inject(ResponseDiscriminatorService)
    private readonly responseDiscriminator: ResponseDiscriminatorService,
    @Inject(ResponseVariantService)
    private readonly responseVariant: ResponseVariantService,
    @Inject(ResponseMessageRepository)
    private readonly responseMessage: ResponseMessageRepository,
    @Inject(ResponseAttachmentService)
    private readonly responseAttachment: ResponseAttachmentService
  ) {}

  prepareImportData(
    {
      responses,
      responseVariants,
      responseAttachments,
      responseDiscriminators,
      responseMessages,
    }: ResponseExportImportDataDTO,
    {
      userID,
      backup,
      assistantID,
      environmentID,
    }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ): {
    responses: ResponseJSON[];
    responseVariants: AnyResponseVariantJSON[];
    responseMessages: ResponseMessageJSON[];
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

        responseMessages:
          responseMessages?.map((item) => ({
            ...item,
            updatedAt: item.updatedAt ?? createdAt,
            updatedByID: item.updatedByID ?? userID,
            assistantID,
            environmentID,
          })) || [],

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

      responseMessages:
        responseMessages?.map((item) => ({
          ...item,
          createdAt,
          updatedAt: createdAt,
          updatedByID: userID,
          assistantID,
          environmentID,
        })) || [],

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
    responseMessages: ResponseMessageObject[];
    responseAttachments: AnyResponseAttachmentObject[];
    responseDiscriminators: ResponseDiscriminatorObject[];
  }) {
    // ORDER MATTERS
    const responses = await this.repository.createMany(data.responses);
    const responseDiscriminators = await this.responseDiscriminator.createMany(data.responseDiscriminators);
    const responseVariants = await this.responseVariant.createMany(data.responseVariants);
    const responseMessages = await this.responseMessage.createMany(data.responseMessages);
    const responseAttachments = await this.responseAttachment.createMany(data.responseAttachments);

    return {
      responses,
      responseVariants,
      responseMessages,
      responseAttachments,
      responseDiscriminators,
    };
  }
}
