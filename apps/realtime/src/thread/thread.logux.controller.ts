import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { ThreadSerializer } from './thread.serializer';
import { ThreadService } from './thread.service';

@Controller()
@InjectRequestContext()
export class ThreadLoguxController {
  constructor(
    @Inject(ThreadService)
    private readonly service: ThreadService,
    @Inject(ThreadSerializer)
    private readonly serializer: ThreadSerializer
  ) {}

  @Action.Async(Actions.Thread.CreateOne)
  @Authorize.Permissions<Actions.Thread.CreateOne.Request>([Permission.PROJECT_READ], ({ context }) => ({
    id: context.projectID,
    kind: 'project',
  }))
  @UseRequestContext()
  public async createOne(
    @Payload() { data, context }: Actions.Thread.CreateOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Thread.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast([data], { auth, context })
      .then(([thread]) => ({ data: this.serializer.nullable(thread), context }));
  }

  @Action.Async(Actions.Thread.CreateMany)
  @Authorize.Permissions<Actions.Thread.CreateMany.Request>([Permission.PROJECT_READ], ({ context }) => ({
    id: context.projectID,
    kind: 'project',
  }))
  @UseRequestContext()
  public async createMany(
    @Payload() { data, context }: Actions.Thread.CreateMany.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Thread.CreateMany.Response> {
    return this.service
      .createManyAndBroadcast(data, { auth, context })
      .then((threads) => ({ data: this.serializer.iterable(threads), context }));
  }

  @Action(Actions.Thread.PatchOne)
  @Authorize.Permissions<Actions.Thread.PatchOne>([Permission.PROJECT_READ], ({ context }) => ({
    id: context.projectID,
    kind: 'project',
  }))
  @Broadcast<Actions.Thread.PatchOne>(({ context }) => ({ channel: Realtime.Channels.version.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  public async patchOne(@Payload() { id, patch }: Actions.Thread.PatchOne) {
    await this.service.patchOne(this.serializer.decodeID(id), patch);
  }

  @Action(Actions.Thread.PatchMany)
  @Authorize.Permissions<Actions.Thread.PatchMany>([Permission.PROJECT_READ], ({ context }) => ({
    id: context.projectID,
    kind: 'project',
  }))
  @Broadcast<Actions.Thread.PatchMany>(({ context }) => ({ channel: Realtime.Channels.version.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  public async patchMany(@Payload() { ids, patch }: Actions.Thread.PatchMany) {
    await this.service.patchMany(ids.map(this.serializer.decodeID), patch);
  }

  @Action(Actions.Thread.MoveMany)
  @Authorize.Permissions<Actions.Thread.MoveMany>([Permission.PROJECT_READ], ({ context }) => ({
    id: context.projectID,
    kind: 'project',
  }))
  @Broadcast<Actions.Thread.MoveMany>(({ context }) => ({ channel: Realtime.Channels.version.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  public async moveMany(@Payload() { data }: Actions.Thread.MoveMany) {
    await this.service.moveMany(data);
  }

  @Action(Actions.Thread.DeleteOne)
  @Authorize.Permissions<Actions.Thread.DeleteOne>([Permission.PROJECT_READ], ({ context }) => ({
    id: context.projectID,
    kind: 'project',
  }))
  @Broadcast<Actions.Thread.DeleteOne>(({ context }) => ({ channel: Realtime.Channels.version.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  public async deleteOne(@Payload() { id, context }: Actions.Thread.DeleteOne, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([this.serializer.decodeID(id)]);

    // overriding threads cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, threads: [] } }, { auth, context });
  }

  @Action(Actions.Thread.DeleteMany)
  @Authorize.Permissions<Actions.Thread.DeleteMany>([Permission.PROJECT_READ], ({ context }) => ({
    id: context.projectID,
    kind: 'project',
  }))
  @Broadcast<Actions.Thread.DeleteMany>(({ context }) => ({ channel: Realtime.Channels.version.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  public async deleteMany(@Payload() { ids, context }: Actions.Thread.DeleteMany, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids.map(this.serializer.decodeID));

    // overriding threads cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, threads: [] } }, { auth, context });
  }

  @Action(Actions.Thread.AddOne)
  @Authorize.Permissions<Actions.Thread.AddOne>([Permission.PROJECT_READ], ({ context }) => ({
    id: context.projectID,
    kind: 'project',
  }))
  @Broadcast<Actions.Thread.AddOne>(({ context }) => ({ channel: Realtime.Channels.version.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.Thread.AddOne) {
    // for broadcast only
  }

  @Action(Actions.Thread.AddMany)
  @Authorize.Permissions<Actions.Thread.AddMany>([Permission.PROJECT_READ], ({ context }) => ({
    id: context.projectID,
    kind: 'project',
  }))
  @Broadcast<Actions.Thread.AddMany>(({ context }) => ({ channel: Realtime.Channels.version.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.Thread.AddMany) {
    // for broadcast only
  }
}
