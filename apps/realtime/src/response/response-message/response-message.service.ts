/* eslint-disable max-params */
import type { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseTarget, ResponseDiscriminatorORM } from '@voiceflow/orm-designer';

import { CMSBroadcastMeta, CMSContext } from '@/types';

import { ResponseMessageDiscriminatorsSyncService } from './discriminators-sync.service';
import { ResponseMessageCreateData } from './response-message.interface';
import { ResponseMessageLoguxService } from './response-message.logux.service';
import { ResponseMessageRepository } from './response-message.repository';
import { ResponseMessageSerializer } from './response-message.serializer';

@Injectable()
export class ResponseMessageService {
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(ResponseDiscriminatorORM)
    protected readonly responseDiscriminatorORM: ResponseDiscriminatorORM,
    @Inject(ResponseMessageLoguxService)
    protected readonly logux: ResponseMessageLoguxService,
    @Inject(ResponseMessageSerializer)
    private readonly serializer: ResponseMessageSerializer,
    @Inject(ResponseMessageDiscriminatorsSyncService)
    private readonly sync: ResponseMessageDiscriminatorsSyncService,
    @Inject(ResponseMessageRepository)
    private readonly repository: ResponseMessageRepository
  ) {}

  async createManyAndSync(
    data: ResponseMessageCreateData[],
    {
      userID,
      context,
      discriminatorOrderInsertIndex,
    }: { userID: number; context: CMSContext; discriminatorOrderInsertIndex?: number }
  ) {
    return this.postgresEM.transactional(async () => {
      const responseMessages = await this.repository.createManyForUser(
        userID,
        data.map((message) => ({
          ...message,
          assistantID: context.assistantID,
          environmentID: context.environmentID,
        }))
      );

      const responseDiscriminators = await this.sync.syncDiscriminators(this.serializer.iterable(responseMessages), {
        action: 'create',
        userID,
        context,
        discriminatorOrderInsertIndex,
      });

      return {
        add: { responseMessages },
        sync: { responseDiscriminators },
      };
    });
  }

  async createManyAndBroadcast(
    data: ResponseMessageCreateData[],
    { auth, context, discriminatorOrderInsertIndex }: CMSBroadcastMeta & { discriminatorOrderInsertIndex?: number }
  ) {
    const result = await this.createManyAndSync(data, { userID: auth.userID, context, discriminatorOrderInsertIndex });

    await this.logux.broadcastAddMany(result, { auth, context });

    return result.add.responseMessages;
  }

  async deleteManyAndSync(ids: string[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const responseMessages = await this.repository.findManyByEnvironmentAndIDs(context.environmentID, ids);

      const responseDiscriminators = await this.sync.syncDiscriminators(this.serializer.iterable(responseMessages), {
        action: 'delete',
        userID,
        context,
      });

      await this.repository.deleteManyByEnvironmentAndIDs(context.environmentID, ids);

      return {
        sync: {
          responseDiscriminators,
        },
        delete: { responseMessages },
      };
    });
  }

  async deleteManyAndBroadcast(ids: string[], meta: CMSBroadcastMeta) {
    const result = await this.deleteManyAndSync(ids, { userID: meta.auth.userID, context: meta.context });

    await this.logux.broadcastDeleteMany(result, meta);
  }
}
