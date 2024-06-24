/* eslint-disable max-params */
import { Inject, Injectable } from '@nestjs/common';
import {
  AnyResponseAttachment,
  AnyResponseVariant,
  Response,
  ResponseDiscriminator,
  ResponseMessage,
} from '@voiceflow/dtos';

import { ResponseRepository } from './response.repository';
import { ResponseAttachmentService } from './response-attachment/response-attachment.service';
import { ResponseDiscriminatorService } from './response-discriminator/response-discriminator.service';
import { ResponseImportService } from './response-import.service';
import { ResponseMessageRepository } from './response-message/response-message.repository';
import { ResponseVariantService } from './response-variant/response-variant.service';

@Injectable()
export class ResponseMigrationService {
  constructor(
    @Inject(ResponseImportService) private readonly importService: ResponseImportService,
    @Inject(ResponseRepository) private readonly repository: ResponseRepository,
    @Inject(ResponseDiscriminatorService)
    private readonly responseDiscriminator: ResponseDiscriminatorService,
    @Inject(ResponseVariantService)
    private readonly responseVariant: ResponseVariantService,
    @Inject(ResponseAttachmentService)
    private readonly responseAttachment: ResponseAttachmentService,
    @Inject(ResponseMessageRepository)
    private readonly responseMessage: ResponseMessageRepository
  ) {}

  async upsertManyWithSubResources(
    data: {
      responses: Response[];
      responseVariants: AnyResponseVariant[];
      responseMessages: ResponseMessage[];
      responseAttachments: AnyResponseAttachment[];
      responseDiscriminators: ResponseDiscriminator[];
    },
    meta: { userID: number; assistantID: string; environmentID: string }
  ) {
    const { responses, responseVariants, responseAttachments, responseMessages, responseDiscriminators } =
      this.importService.prepareImportData(data, meta);

    await this.repository.upsertMany(this.repository.mapFromJSON(responses));
    await this.responseDiscriminator.upsertMany(this.responseDiscriminator.mapFromJSON(responseDiscriminators));
    await this.responseVariant.upsertMany(this.responseVariant.mapFromJSON(responseVariants));
    await this.responseMessage.upsertMany(this.responseMessage.mapFromJSON(responseMessages));
    await this.responseAttachment.upsertMany(this.responseAttachment.mapFromJSON(responseAttachments));
  }
}
