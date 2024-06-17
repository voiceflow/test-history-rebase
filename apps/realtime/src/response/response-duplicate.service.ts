import { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import { ObjectId } from 'bson';
import _ from 'lodash';

import { CMSContext } from '@/types';

import {
  DuplicateDiscriminator,
  DuplicateMessage,
  DuplicateResponse,
  OMIT_DUPLICATE_DISCRIMINATOR,
  OMIT_DUPLICATE_MESSAGES,
  OMIT_DUPLICATE_RESPONSE,
} from './response.interface';
import { ResponseRepository } from './response.repository';
import { ResponseDiscriminatorService } from './response-discriminator/response-discriminator.service';
import { ResponseMessageRepository } from './response-message/response-message.repository';

@Injectable()
export class ResponseDuplicateService {
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    protected readonly postgresEM: EntityManager,
    @Inject(ResponseRepository)
    private readonly repository: ResponseRepository,
    @Inject(ResponseDiscriminatorService)
    private readonly responseDiscriminator: ResponseDiscriminatorService,
    @Inject(ResponseMessageRepository)
    private readonly responseMessage: ResponseMessageRepository
  ) {}

  duplicate(responseIDs: string[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      // Fetch responses and their discriminators
      const [sourceResponses, sourceDiscriminators] = await Promise.all([
        this.repository.findManyByEnvironmentAndIDs(context.environmentID, responseIDs),
        this.responseDiscriminator.findManyByResponses(context.environmentID, responseIDs),
      ]);

      const discriminatorIDs = sourceDiscriminators.map((d) => d.id);
      const sourceMessages = await this.responseMessage.findManyByDiscriminators(
        context.environmentID,
        discriminatorIDs
      );

      // Group discriminators by response ID
      const sourceDiscriminatorsByResponseID = _.groupBy(sourceDiscriminators, (item) => item.responseID);
      const sourceMessagesByDiscriminatorID = _.groupBy(sourceMessages, (item) => item.discriminatorID);

      const newResponsesData: Array<DuplicateResponse> = [];
      const newDiscriminatorsData: Array<DuplicateDiscriminator> = [];
      const newMessagesData: Array<DuplicateMessage> = [];

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

          sourceMessagesByDiscriminatorID[discriminator.id]?.forEach((message) => {
            const newMessageID = new ObjectId().toJSON();

            variantIDRemap[message.id] = newMessageID;

            const newMessage = {
              ...Utils.object.omit(message, [...OMIT_DUPLICATE_MESSAGES]),
              id: newMessageID,
              assistantID: context.assistantID,
              environmentID: context.environmentID,
              discriminatorID: newDiscriminator.id,
            };

            newMessagesData.push(newMessage);
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
      const responseMessages = await this.responseMessage.createManyForUser(userID, newMessagesData);

      return {
        responses,
        responseDiscriminators,
        responseMessages,
      };
    });
  }
}
