import { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type { ThreadCommentObject, ThreadObject } from '@voiceflow/orm-designer';
import { DatabaseTarget, ThreadORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { LegacyVersionActionContext } from '@voiceflow/sdk-logux-designer/build/types';

import { MutableService } from '@/common';
import { legacyVersionBroadcastContext, toPostgresEntityIDs } from '@/common/utils';

import { ThreadCreateData } from './thread.interface';
import { ThreadSerializer } from './thread.serializer';
import { ThreadCommentSerializer } from './thread-comment/thread-comment.serializer';
import { ThreadCommentService } from './thread-comment/thread-comment.service';

@Injectable()
export class ThreadService extends MutableService<ThreadORM> {
  // eslint-disable-next-line max-params
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
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
    const threadComments = await this.threadComment.findManyByThreads(toPostgresEntityIDs(threads));

    return {
      threads: this.threadSerializer.iterable(threads),
      threadComments: this.threadCommentSerializer.iterable(threadComments),
    };
  }

  /* Create */

  async createManyAndSync(data: ThreadCreateData[]) {
    const result = await this.postgresEM.transactional(async () => {
      const threads = await this.createMany(data.map((thread) => Utils.object.omit(thread, ['comments'])));
      const threadComments = await this.threadComment.createMany(
        data.flatMap(
          (thread, index) => thread.comments?.map((comment) => ({ ...comment, threadID: threads[index].id })) ?? []
        )
      );

      return {
        add: { threads, threadComments },
      };
    });

    this.threadComment.notifyMany(result.add.threadComments, { threads: result.add.threads });

    return result;
  }

  async broadcastAddMany(
    { add }: { add: { threads: ThreadObject[]; threadComments: ThreadCommentObject[] } },
    meta: { auth: AuthMetaPayload; context: LegacyVersionActionContext }
  ) {
    await Promise.all([
      this.threadComment.broadcastAddMany({ add: Utils.object.pick(add, ['threadComments']) }, meta),

      this.logux.processAs(
        Actions.Thread.AddMany({
          data: add.threads.map((thread) => this.threadSerializer.nullable(thread)),
          context: legacyVersionBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }

  async createManyAndBroadcast(
    data: ThreadCreateData[],
    meta: { auth: AuthMetaPayload; context: LegacyVersionActionContext }
  ) {
    const result = await this.createManyAndSync(data);

    await this.broadcastAddMany(result, meta);

    return result.add.threads;
  }

  /* Delete */

  async collectRelationsToDelete(threadIDs: number[]) {
    const threadComments = await this.threadComment.findManyByThreads(threadIDs);

    return {
      threadComments,
    };
  }

  async deleteManyWithRelations({
    threads,
    threadComments,
  }: {
    threads: ThreadObject[];
    threadComments: ThreadCommentObject[];
  }) {
    await this.threadComment.deleteMany(toPostgresEntityIDs(threadComments));
    await this.deleteMany(toPostgresEntityIDs(threads));
  }

  async deleteManyAndSync(threadIDs: number[]) {
    const [threads, relations] = await Promise.all([
      this.findMany(threadIDs),
      this.collectRelationsToDelete(threadIDs),
    ]);

    await this.deleteManyWithRelations({ ...relations, threads });

    return {
      delete: { ...relations, threads },
    };
  }

  async deleteManyByDiagramsAndSync(diagramIDs: string[]) {
    const threads = await this.findManyByDiagrams(diagramIDs);
    const relations = await this.collectRelationsToDelete(toPostgresEntityIDs(threads));

    await this.deleteManyWithRelations({ ...relations, threads });

    return {
      delete: { ...relations, threads },
    };
  }

  async broadcastDeleteMany(
    {
      delete: del,
    }: {
      delete: {
        threads: ThreadObject[];
        threadComments: ThreadCommentObject[];
      };
    },
    meta: { auth: AuthMetaPayload; context: LegacyVersionActionContext }
  ) {
    await Promise.all([
      this.threadComment.broadcastDeleteMany({ delete: Utils.object.pick(del, ['threadComments']) }, meta),

      this.logux.processAs(
        Actions.Thread.DeleteMany({
          ids: toPostgresEntityIDs(del.threads).map(this.threadSerializer.encodeID),
          context: legacyVersionBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }

  async deleteManyAndBroadcast(
    ids: number[],
    meta: { auth: AuthMetaPayload; context: LegacyVersionActionContext }
  ): Promise<void> {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(result, meta);
  }

  async deleteManyByDiagramsAndBroadcast(
    diagramIDs: string[],
    meta: { auth: AuthMetaPayload; context: LegacyVersionActionContext }
  ): Promise<void> {
    const result = await this.deleteManyByDiagramsAndSync(diagramIDs);

    await this.broadcastDeleteMany(result, meta);
  }

  async moveMany(data: Record<string, [number, number]>) {
    await Promise.all(
      Object.entries(data).map(([id, position]) => this.patchOne(this.threadSerializer.decodeID(id), { position }))
    );
  }
}
