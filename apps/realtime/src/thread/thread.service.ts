/* eslint-disable no-restricted-syntax, no-await-in-loop */
import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type { ORMMutateOptions, PKOrEntity, ThreadCommentEntity, ThreadEntity } from '@voiceflow/orm-designer';
import { ThreadORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { LegacyVersionActionContext } from '@voiceflow/sdk-logux-designer/build/types';

import { MutableService } from '@/common';
import { legacyVersionBroadcastContext, toEntityIDs } from '@/common/utils';

import { ThreadCreateData } from './thread.interface';
import { ThreadSerializer } from './thread.serializer';
import { ThreadCommentSerializer } from './thread-comment/thread-comment.serializer';
import { ThreadCommentService } from './thread-comment/thread-comment.service';

@Injectable()
export class ThreadService extends MutableService<ThreadORM> {
  constructor(
    @Inject(ThreadORM)
    protected readonly orm: ThreadORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(ThreadCommentService)
    private readonly threadComment: ThreadCommentService,
    @Inject(ThreadSerializer)
    private readonly threadSerializer: ThreadSerializer,
    @Inject(ThreadCommentSerializer)
    private readonly threadCommentSerializer: ThreadCommentSerializer
  ) {
    super();
  }

  /* Find */

  async findManyByDiagrams(diagramIDs: string[]) {
    return this.orm.findManyByDiagrams(diagramIDs);
  }

  async findAllWithCommentsByAssistant(assistantID: string) {
    const threads = await this.orm.findManyByAssistant(assistantID);
    const threadComments = await this.threadComment.findManyByThreads(threads);

    return {
      threads: this.threadSerializer.iterable(threads),
      threadComments: this.threadCommentSerializer.iterable(threadComments),
    };
  }

  /* Create */

  async createManyAndSync(data: ThreadCreateData[]) {
    const threads: ThreadEntity[] = [];
    const threadComments: ThreadCommentEntity[] = [];

    for (const { comments: commentsData, ...threadData } of data) {
      const thread = await this.createOne(threadData);

      threads.push(thread);

      if (commentsData?.length) {
        const sync = await this.threadComment.createManyAndSync(
          commentsData.map((comment) => ({
            ...comment,
            threadID: thread.id,
            authorID: comment.authorID,
          }))
        );

        threadComments.push(...sync.add.threadComments);

        sync.add.threadComments.forEach((comment) => this.threadComment.notifyMentions(comment, { thread }));
      }
    }

    return {
      add: { threads, threadComments },
    };
  }

  async broadcastAddMany(
    authMeta: AuthMetaPayload,
    context: LegacyVersionActionContext,
    { add }: { add: { threads: ThreadEntity[]; threadComments: ThreadCommentEntity[] } }
  ) {
    await Promise.all([
      this.threadComment.broadcastAddMany(authMeta, context, { add: Utils.object.pick(add, ['threadComments']) }),

      this.logux.processAs(
        Actions.Thread.AddMany({
          data: add.threads.map((thread) => this.threadSerializer.nullable(thread)),
          context: legacyVersionBroadcastContext(context),
        }),
        authMeta
      ),
    ]);
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, context: LegacyVersionActionContext, data: ThreadCreateData[]) {
    const result = await this.createManyAndSync(data);

    await this.broadcastAddMany(authMeta, context, result);

    return result.add.threads;
  }

  /* Delete */

  async collectRelationsToDelete(threads: PKOrEntity<ThreadEntity>[]) {
    const threadComments = await this.threadComment.findManyByThreads(threads);

    return {
      threadComments,
    };
  }

  async deleteManyWithRelations(
    {
      threads,
      threadComments,
    }: {
      threads: PKOrEntity<ThreadEntity>[];
      threadComments: PKOrEntity<ThreadCommentEntity>[];
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    await Promise.all([this.threadComment.deleteMany(threadComments, { flush: false }), this.deleteMany(threads, { flush: false })]);

    if (flush) {
      await this.orm.em.flush();
    }
  }

  async deleteManyAndSync(threadIDs: Primary<ThreadEntity>[]) {
    const threads = await this.findMany(threadIDs);
    const relations = await this.collectRelationsToDelete(threads);

    await this.deleteManyWithRelations({ ...relations, threads });

    return {
      delete: { ...relations, threads },
    };
  }

  async deleteManyByDiagramsAndSync(diagramIDs: string[]) {
    const threads = await this.findManyByDiagrams(diagramIDs);
    const relations = await this.collectRelationsToDelete(threads);

    await this.deleteManyWithRelations({ ...relations, threads });

    return {
      delete: { ...relations, threads },
    };
  }

  async broadcastDeleteMany(
    authMeta: AuthMetaPayload,
    context: LegacyVersionActionContext,
    {
      delete: del,
    }: {
      delete: {
        threads: ThreadEntity[];
        threadComments: ThreadCommentEntity[];
      };
    }
  ) {
    await Promise.all([
      this.threadComment.broadcastDeleteMany(authMeta, context, { delete: Utils.object.pick(del, ['threadComments']) }),

      this.logux.processAs(
        Actions.Thread.DeleteMany({
          ids: toEntityIDs(del.threads).map(this.threadSerializer.encodeID),
          context: legacyVersionBroadcastContext(context),
        }),
        authMeta
      ),
    ]);
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, context: LegacyVersionActionContext, ids: number[]): Promise<void> {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, context, result);
  }

  async deleteManyByDiagramsAndBroadcast(authMeta: AuthMetaPayload, context: LegacyVersionActionContext, diagramIDs: string[]): Promise<void> {
    const result = await this.deleteManyByDiagramsAndSync(diagramIDs);

    await this.broadcastDeleteMany(authMeta, context, result);
  }
}
