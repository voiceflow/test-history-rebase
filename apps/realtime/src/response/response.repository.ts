import { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { Channel, Language } from '@voiceflow/dtos';
import { DatabaseTarget, ObjectId, ResponseORM } from '@voiceflow/orm-designer';

import { CMSTabularService } from '@/common';
import { toPostgresEntityIDs } from '@/common/utils';
import { CMSContext } from '@/types';

import { ResponseCreateWithSubResourcesData } from './response.interface';
import { ResponseAttachmentService } from './response-attachment/response-attachment.service';
import { ResponseDiscriminatorService } from './response-discriminator/response-discriminator.service';
import { ResponseMessageRepository } from './response-message/response-message.repository';
import { ResponseRequiredEntityService } from './response-required-entity.service';
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
    @Inject(ResponseRequiredEntityService)
    private readonly requiredEntitiesService: ResponseRequiredEntityService
  ) {
    super();
  }

  async findManyWithSubResourcesByEnvironment(environmentID: string) {
    const [responses, responseVariants, responseAttachments, responseDiscriminators] = await Promise.all([
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
    };
  }

  async createManyResponses(
    data: ResponseCreateWithSubResourcesData[],
    { userID, context }: { userID: number; context: CMSContext }
  ) {
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

  async deleteManyResponsesAndRelations(ids: string[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const responses = await this.findManyByEnvironmentAndIDs(context.environmentID, ids);

      const [relations, requiredEntities] = await Promise.all([
        this.collectRelationsToDelete(context.environmentID, ids),
        this.requiredEntitiesService.removeResponseReferencesFromReprompts(userID, context.environmentID, ids),
      ]);

      await this.deleteManyByEnvironmentAndIDs(context.environmentID, ids);

      return {
        ...relations,
        requiredEntities,
        responses,
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
}
