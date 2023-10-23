/* eslint-disable max-params */
import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type {
  AnyResponseAttachmentEntity,
  AnyResponseVariantEntity,
  AssistantEntity,
  ORMMutateOptions,
  PKOrEntity,
  PromptEntity,
  ResponseDiscriminatorEntity,
  ResponseEntity,
} from '@voiceflow/orm-designer';
import { AssistantORM, ResponseDiscriminatorORM, ResponseORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { EntitySerializer, MutableService } from '@/common';
import type { CreateOneData } from '@/common/types';
import { broadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';

import { ResponseVariantService } from '../response-variant/response-variant.service';

@Injectable()
export class ResponseDiscriminatorService extends MutableService<ResponseDiscriminatorORM> {
  constructor(
    @Inject(ResponseDiscriminatorORM)
    protected readonly orm: ResponseDiscriminatorORM,
    @Inject(ResponseORM)
    protected readonly responseORM: ResponseORM,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(ResponseVariantService)
    protected readonly responseVariant: ResponseVariantService,
    @Inject(EntitySerializer)
    protected readonly entitySerializer: EntitySerializer
  ) {
    super();
  }

  /* Find */

  findManyByResponses(responses: PKOrEntity<ResponseEntity>[]) {
    return this.orm.findManyByResponses(responses);
  }

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findManyByAssistant(assistant, environmentID);
  }

  /* Create */

  async createManyAndSync(data: CreateOneData<ResponseDiscriminatorORM>[]) {
    const responseDiscriminators = await this.createMany(data);

    return {
      add: {
        prompts: [],
        responseVariants: [],
        responseAttachments: [],
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
        responseVariants: AnyResponseVariantEntity[];
        responseAttachments: AnyResponseAttachmentEntity[];
        responseDiscriminators: ResponseDiscriminatorEntity[];
      };
    }
  ) {
    await Promise.all([
      this.responseVariant.broadcastAddMany(authMeta, {
        add: Utils.object.pick(add, ['prompts', 'responseVariants', 'responseAttachments']),
        // no need to sync, cause should be synced on create
        sync: { responseDiscriminators: [] },
      }),

      ...groupByAssistant(add.responseDiscriminators).map((discriminators) =>
        this.logux.processAs(
          Actions.ResponseDiscriminator.AddMany({
            data: this.entitySerializer.iterable(discriminators),
            context: broadcastContext(discriminators[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: CreateOneData<ResponseDiscriminatorORM>[]) {
    const result = await this.createManyAndSync(data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.responseDiscriminators;
  }

  /* Delete */

  async collectRelationsToDelete(responseDiscriminators: PKOrEntity<ResponseDiscriminatorEntity>[]) {
    const responseVariants = await this.responseVariant.findManyByDiscriminators(responseDiscriminators);
    const relations = await this.responseVariant.collectRelationsToDelete(responseVariants);

    return {
      ...relations,
      responseVariants,
    };
  }

  async deleteManyAndSync(ids: Primary<ResponseDiscriminatorEntity>[]) {
    const responseDiscriminators = await this.findMany(ids);

    const relations = await this.collectRelationsToDelete(responseDiscriminators);

    await this.deleteMany(responseDiscriminators);

    return {
      delete: {
        ...relations,
        responseDiscriminators,
      },
    };
  }

  async broadcastDeleteMany(
    authMeta: AuthMetaPayload,
    {
      delete: del,
    }: {
      delete: {
        responseVariants: AnyResponseVariantEntity[];
        responseAttachments: AnyResponseAttachmentEntity[];
        responseDiscriminators: ResponseDiscriminatorEntity[];
      };
    }
  ) {
    await Promise.all([
      ...groupByAssistant(del.responseDiscriminators).map((discriminators) =>
        this.logux.processAs(
          Actions.ResponseDiscriminator.DeleteMany({
            ids: toEntityIDs(discriminators),
            context: broadcastContext(discriminators[0]),
          }),
          authMeta
        )
      ),

      this.responseVariant.broadcastDeleteMany(authMeta, {
        // no need to sync discriminators, because they are deleted
        sync: { responseDiscriminators: [] },
        delete: Utils.object.pick(del, ['responseVariants', 'responseAttachments']),
      }),
    ]);
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<ResponseDiscriminatorEntity>[]) {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }
}
