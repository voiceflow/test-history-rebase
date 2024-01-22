/* eslint-disable max-params */
import type { EntityManager } from '@mikro-orm/core';
import { Primary } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type {
  AnyResponseAttachmentEntity,
  AnyResponseVariantEntity,
  AssistantEntity,
  PKOrEntity,
  PromptEntity,
  ResponseDiscriminatorEntity,
  ResponseEntity,
} from '@voiceflow/orm-designer';
import { AssistantORM, DatabaseTarget, ResponseDiscriminatorORM, ResponseORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSObjectService, EntitySerializer } from '@/common';
import type { CreateOneForUserData } from '@/common/types';
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';

import { ResponseVariantService } from '../response-variant/response-variant.service';

@Injectable()
export class ResponseDiscriminatorService extends CMSObjectService<ResponseDiscriminatorORM> {
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
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

  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findManyByEnvironment(assistant, environmentID);
  }

  /* Create */

  async createManyAndSync(userID: number, data: CreateOneForUserData<ResponseDiscriminatorORM>[]) {
    return this.postgresEM.transactional(async () => {
      const responseDiscriminators = await this.createManyForUser(userID, data);

      return {
        add: {
          prompts: [],
          responseVariants: [],
          responseAttachments: [],
          responseDiscriminators,
        },
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
            context: assistantBroadcastContext(discriminators[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: CreateOneForUserData<ResponseDiscriminatorORM>[]) {
    const result = await this.createManyAndSync(authMeta.userID, data);

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
    return this.postgresEM.transactional(async () => {
      const responseDiscriminators = await this.findMany(ids);

      const relations = await this.collectRelationsToDelete(responseDiscriminators);

      await this.deleteMany(responseDiscriminators);

      return {
        delete: {
          ...relations,
          responseDiscriminators,
        },
      };
    });
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
            context: assistantBroadcastContext(discriminators[0]),
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
