/* eslint-disable max-params */
/* eslint-disable no-await-in-loop */
import { Primary } from '@mikro-orm/core';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import { PKOrEntity, ThreadCommentEntity, ThreadCommentORM, ThreadEntity, ThreadORM } from '@voiceflow/orm-designer';
import { IdentityClient } from '@voiceflow/sdk-identity';
import { Actions } from '@voiceflow/sdk-logux-designer';
import type { LegacyVersionActionContext } from '@voiceflow/sdk-logux-designer/build/types';
import dayjs from 'dayjs';

import { AssistantService } from '@/assistant/assistant.service';
import { MutableService } from '@/common';
import type { CreateManyData, PatchManyData, PatchOneData } from '@/common/types';
import { legacyVersionBroadcastContext, toEntityIDs } from '@/common/utils';
import { CreatorAppService } from '@/creator-app/creator-app.service';
import { EmailService } from '@/email/email.service';
import { EmailSubscriptionGroup } from '@/email/enum/email-subscription-group.enum';
import { EmailTemplate } from '@/email/enum/email-template.enum';
import { ProductUpdateService } from '@/product-update/product-update.service';

import { ThreadSerializer } from '../thread.serializer';
import { THREAD_COMMENT_MENTION_MARKUP_REGEX, THREAD_COMMENT_MENTION_REGEX } from './thread-comment.constant';
import { ThreadCommentSerializer } from './thread-comment.serializer';

@Injectable()
export class ThreadCommentService extends MutableService<ThreadCommentORM> {
  private readonly logger: Logger = new Logger(ThreadCommentService.name);

  constructor(
    @Inject(ThreadCommentORM)
    protected readonly orm: ThreadCommentORM,
    @Inject(ThreadORM)
    protected readonly threadORM: ThreadORM,
    @Inject(IdentityClient)
    private readonly identity: IdentityClient,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(EmailService)
    protected readonly email: EmailService,
    @Inject(AssistantService)
    protected readonly assistant: AssistantService,
    @Inject(CreatorAppService)
    protected readonly creatorApp: CreatorAppService,
    @Inject(ProductUpdateService)
    protected readonly productUpdate: ProductUpdateService,
    @Inject(ThreadSerializer)
    private readonly threadSerializer: ThreadSerializer,
    @Inject(ThreadCommentSerializer)
    private readonly threadCommentSerializer: ThreadCommentSerializer
  ) {
    super();
  }

  /* Find */

  async findManyByThreads(threads: PKOrEntity<ThreadEntity>[]) {
    return this.orm.findManyByThreads(threads);
  }

  /* Patch */

  async patchOneAndNotify(id: Primary<ThreadCommentEntity>, data: PatchOneData<ThreadCommentORM>) {
    if (!data.mentions) {
      await this.patchOne(id, data);

      return;
    }

    const originalComment = await this.findOneOrFail(id);

    await this.orm.patchOne(id, data);

    const updatedComment = await this.findOneOrFail(id);

    const newMentionIDs = updatedComment.mentions.filter((id) => !originalComment.mentions.includes(id));

    this.notifyMentions(updatedComment, { mentionIDs: newMentionIDs });
  }

  async patchManyAndNotify(ids: Primary<ThreadCommentEntity>[], data: PatchManyData<ThreadCommentORM>) {
    if (!data.mentions) {
      await this.patchMany(ids, data);

      return;
    }

    await Promise.all(ids.map((id) => this.patchOneAndNotify(id, data)));
  }

  /* Notify */

  private async createManyProductUpdates({
    mentionIDs,
    authorName,
    commentURL,
    projectName,
  }: {
    mentionIDs: number[];
    authorName: string;
    commentURL: URL;
    projectName: string;
  }) {
    const details = `${authorName} has tagged you in a [comment](${commentURL.toJSON()}) in ${projectName}`;

    await this.productUpdate.createMany(mentionIDs.map((creatorID) => ({ type: null, details, creatorID })));
  }

  private async sendManyMentionedEmails({
    emails,
    comment,
    commentURL,
    authorName,
    projectName,
  }: {
    emails: string[];
    comment: ThreadCommentEntity;
    commentURL: URL;
    authorName: string;
    projectName: string;
  }) {
    await Promise.all(
      emails.map((email) =>
        this.email.sendNotifications(email, EmailTemplate.MENTION_COMMENTING, {
          asm: {
            groupId: EmailSubscriptionGroup.COMMENTING,
            groupsToDisplay: [EmailSubscriptionGroup.COMMENTING, EmailSubscriptionGroup.PROJECT_ACTIVITY],
          },
          dynamicTemplateData: {
            text: comment.text.replace(THREAD_COMMENT_MENTION_MARKUP_REGEX, (str) => str.match(THREAD_COMMENT_MENTION_REGEX)?.[0] ?? ''),
            created_at: dayjs(comment.createdAt).format('MMM Do YYYY'),
            projectName,
            commentLink: commentURL.toJSON(),
            commenterName: authorName,
          },
        })
      )
    );
  }

  async notifyMentions(
    comment: ThreadCommentEntity,
    { thread: threadProp, mentionIDs = comment.mentions }: { thread?: ThreadEntity; mentionIDs?: number[] } = {}
  ) {
    if (!mentionIDs.length) return;

    try {
      const thread = threadProp ?? (await this.threadORM.findOneOrFail(comment.thread.id));
      const assistant = await this.assistant.findOneOrFail(thread.assistantID);

      const [author, mentions] = await Promise.all([
        this.identity.private.findUserByID(comment.author.id),
        this.identity.private.findAllUsers({ ids: mentionIDs.filter((id) => id !== comment.author.id) }),
      ]);

      const commentURL = this.creatorApp.getCommentingURL({
        threadID: this.threadSerializer.encodeID(thread.id),
        commentID: this.threadCommentSerializer.encodeID(comment.id),
        diagramID: thread.diagramID,
        versionID: assistant.activeEnvironmentID,
      });

      await Promise.all([
        this.createManyProductUpdates({
          mentionIDs: mentions.map(({ id }) => id),
          authorName: author.name,
          projectName: assistant.name,
          commentURL,
        }),
        this.sendManyMentionedEmails({
          emails: mentions.map(({ email }) => email),
          comment,
          authorName: author.name,
          projectName: assistant.name,
          commentURL,
        }),
      ]);
    } catch (error) {
      this.logger.error(error);
    }
  }

  /* Create */

  async createManyAndSync(data: CreateManyData<ThreadCommentORM>) {
    const threadComments = await this.createMany(data);

    return {
      add: { threadComments },
    };
  }

  async broadcastAddMany(
    authMeta: AuthMetaPayload,
    context: LegacyVersionActionContext,
    { add }: { add: { threadComments: ThreadCommentEntity[] } }
  ) {
    await this.logux.processAs(
      Actions.ThreadComment.AddMany({
        data: this.threadCommentSerializer.iterable(add.threadComments),
        context: legacyVersionBroadcastContext(context),
      }),
      authMeta
    );
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, context: LegacyVersionActionContext, data: CreateManyData<ThreadCommentORM>) {
    const result = await this.createManyAndSync(data);

    await this.broadcastAddMany(authMeta, context, result);

    result.add.threadComments.forEach((comment) => this.notifyMentions(comment));

    return result.add.threadComments;
  }

  /* Delete */

  async deleteManyAndSync(ids: Primary<ThreadCommentEntity>[]) {
    const threadComments = await this.findMany(ids);

    const threadIDs = Utils.array.unique(threadComments.map(({ thread }) => thread.id));

    await this.deleteMany(threadComments);

    const threadIDsToRemove: Primary<ThreadEntity>[] = [];

    for (const threadID of threadIDs) {
      const remainingThreadComments = await this.findManyByThreads([threadID]);

      if (remainingThreadComments.length === 0) {
        threadIDsToRemove.push(threadID);
      }
    }

    const threads = await this.threadORM.findMany(threadIDsToRemove);

    await this.threadORM.deleteMany(threads);

    return {
      delete: { threads, threadComments },
    };
  }

  async broadcastDeleteMany(
    authMeta: AuthMetaPayload,
    context: LegacyVersionActionContext,
    { delete: del }: { delete: { threads?: ThreadEntity[]; threadComments: ThreadCommentEntity[] } }
  ) {
    if (del.threads?.length) {
      await this.logux.processAs(
        Actions.Thread.DeleteMany({
          ids: toEntityIDs(del.threads).map(this.threadSerializer.encodeID),
          context: legacyVersionBroadcastContext(context),
        }),
        authMeta
      );
    }

    await this.logux.processAs(
      Actions.ThreadComment.DeleteMany({
        ids: toEntityIDs(del.threadComments).map(this.threadCommentSerializer.encodeID),
        context: legacyVersionBroadcastContext(context),
      }),
      authMeta
    );
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, context: LegacyVersionActionContext, ids: Primary<ThreadCommentEntity>[]) {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, context, result);
  }
}
