import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { ThreadCommentSerializer } from './thread-comment.serializer';
import { ThreadCommentService } from './thread-comment.service';

@Controller()
@InjectRequestContext()
export class ThreadCommentLoguxController {
  constructor(
    @Inject(ThreadCommentService)
    private readonly service: ThreadCommentService,
    @Inject(ThreadCommentSerializer)
    private readonly serializer: ThreadCommentSerializer
  ) {}

  @Action.Async(Actions.ThreadComment.CreateOne)
  @Authorize.Permissions<Actions.ThreadComment.CreateOne.Request>([Permission.PROJECT_READ], ({ context }) => ({
    id: context.projectID,
    kind: 'project',
  }))
  @UseRequestContext()
  public async createOne(
    @Payload() { data, context }: Actions.ThreadComment.CreateOne.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.ThreadComment.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast(authMeta, context, [{ ...data, threadID: this.serializer.decodeID(data.threadID) }])
      .then(([thread]) => ({ data: this.serializer.nullable(thread), context }));
  }

  @Action.Async(Actions.ThreadComment.CreateMany)
  @Authorize.Permissions<Actions.ThreadComment.CreateMany.Request>([Permission.PROJECT_READ], ({ context }) => ({
    id: context.projectID,
    kind: 'project',
  }))
  @UseRequestContext()
  public async createMany(
    @Payload() { data, context }: Actions.ThreadComment.CreateMany.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.ThreadComment.CreateMany.Response> {
    return this.service
      .createManyAndBroadcast(
        authMeta,
        context,
        data.map((item) => ({ ...item, threadID: this.serializer.decodeID(item.threadID) }))
      )
      .then((threads) => ({ data: this.serializer.iterable(threads), context }));
  }

  @Action(Actions.ThreadComment.PatchOne)
  @Authorize.Permissions<Actions.ThreadComment.PatchOne>([Permission.PROJECT_READ], ({ context }) => ({
    id: context.projectID,
    kind: 'project',
  }))
  @Broadcast<Actions.ThreadComment.PatchOne>(({ context }) => ({ channel: Realtime.Channels.version.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  public async patchOne(@Payload() { id, patch }: Actions.ThreadComment.PatchOne) {
    await this.service.patchOneAndNotify(this.serializer.decodeID(id), patch);
  }

  @Action(Actions.ThreadComment.PatchMany)
  @Authorize.Permissions<Actions.ThreadComment.PatchMany>([Permission.PROJECT_READ], ({ context }) => ({
    id: context.projectID,
    kind: 'project',
  }))
  @Broadcast<Actions.ThreadComment.PatchMany>(({ context }) => ({ channel: Realtime.Channels.version.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  public async patchMany(@Payload() { ids, patch }: Actions.ThreadComment.PatchMany) {
    await this.service.patchManyAndNotify(ids.map(this.serializer.decodeID), patch);
  }

  @Action(Actions.ThreadComment.DeleteOne)
  @Authorize.Permissions<Actions.ThreadComment.DeleteOne>([Permission.PROJECT_READ], ({ context }) => ({
    id: context.projectID,
    kind: 'project',
  }))
  @Broadcast<Actions.ThreadComment.DeleteOne>(({ context }) => ({ channel: Realtime.Channels.version.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  public async deleteOne(@Payload() { id, context }: Actions.ThreadComment.DeleteOne, @AuthMeta() authMeta: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([this.serializer.decodeID(id)]);

    // overriding threads cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(authMeta, context, { ...result, delete: { ...result.delete, threadComments: [] } });
  }

  @Action(Actions.ThreadComment.DeleteMany)
  @Authorize.Permissions<Actions.ThreadComment.DeleteMany>([Permission.PROJECT_READ], ({ context }) => ({
    id: context.projectID,
    kind: 'project',
  }))
  @Broadcast<Actions.ThreadComment.DeleteMany>(({ context }) => ({ channel: Realtime.Channels.version.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  public async deleteMany(@Payload() { ids, context }: Actions.ThreadComment.DeleteMany, @AuthMeta() authMeta: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids.map(this.serializer.decodeID));

    // overriding threadComments cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(authMeta, context, { ...result, delete: { ...result.delete, threadComments: [] } });
  }

  @Action(Actions.ThreadComment.AddOne)
  @Authorize.Permissions<Actions.ThreadComment.AddOne>([Permission.PROJECT_READ], ({ context }) => ({
    id: context.projectID,
    kind: 'project',
  }))
  @Broadcast<Actions.ThreadComment.AddOne>(({ context }) => ({ channel: Realtime.Channels.version.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.ThreadComment.AddOne) {
    // for broadcast only
  }

  @Action(Actions.ThreadComment.AddMany)
  @Authorize.Permissions<Actions.ThreadComment.AddMany>([Permission.PROJECT_READ], ({ context }) => ({
    id: context.projectID,
    kind: 'project',
  }))
  @Broadcast<Actions.ThreadComment.AddMany>(({ context }) => ({ channel: Realtime.Channels.version.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.ThreadComment.AddMany) {
    // for broadcast only
  }
}
