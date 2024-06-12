import { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import { ObjectId } from 'bson';
import _ from 'lodash';

import { CMSContext } from '@/types';

import {
  DuplicateAttachment,
  DuplicateDiscriminator,
  DuplicateResponse,
  DuplicateVariant,
  OMIT_DUPLICATE_ATTACHMENT,
  OMIT_DUPLICATE_DISCRIMINATOR,
  OMIT_DUPLICATE_RESPONSE,
  OMIT_DUPLICATE_VARIANTS,
} from './response.interface';
import { ResponseRepository } from './response.repository';
import { ResponseAttachmentService } from './response-attachment/response-attachment.service';
import { ResponseDiscriminatorService } from './response-discriminator/response-discriminator.service';
import { ResponseVariantService } from './response-variant/response-variant.service';

@Injectable()
export class ResponseDuplicateService {
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    protected readonly postgresEM: EntityManager,
    @Inject(ResponseRepository)
    private readonly repository: ResponseRepository,
    @Inject(ResponseDiscriminatorService)
    private readonly responseDiscriminator: ResponseDiscriminatorService,
    @Inject(ResponseVariantService)
    private readonly responseVariant: ResponseVariantService,
    @Inject(ResponseAttachmentService)
    private readonly responseAttachment: ResponseAttachmentService
  ) {}

  duplicate(responseIDs: string[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      // Fetch responses and their discriminators
      const [sourceResponses, sourceDiscriminators] = await Promise.all([
        this.repository.findManyByEnvironmentAndIDs(context.environmentID, responseIDs),
        this.responseDiscriminator.findManyByResponses(context.environmentID, responseIDs),
      ]);

      const discriminatorIDs = sourceDiscriminators.map((d) => d.id);
      const sourceVariants = await this.responseVariant.findManyByDiscriminators(
        context.environmentID,
        discriminatorIDs
      );

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
      const responses = await this.repository.createManyForUser(userID, newResponsesData);
      const responseDiscriminators = await this.responseDiscriminator.createManyForUser(userID, newDiscriminatorsData);
      const responseVariants = await this.responseVariant.createMany(newVariantsData as any);
      const responseAttachments = await this.responseAttachment.createMany(newAttachmentsData as any);

      return {
        responses,
        responseDiscriminators,
        responseVariants,
        responseAttachments,
      };
    });
  }
}
