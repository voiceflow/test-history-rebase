import type { MikroORM } from '@mikro-orm/core';
import { UseRequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, EntitySerializer } from '@/common';

import { ResponseService } from './response.service';

@Controller()
export class ResponseLoguxController {
  constructor(
    @Inject(getMikroORMToken(DatabaseTarget.POSTGRES))
    private readonly orm: MikroORM,
    @Inject(ResponseService)
    private readonly service: ResponseService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  @Action.Async(Actions.Response.CreateOne)
  @Authorize.Permissions<Actions.Prompt.CreateOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createOne(
    @Payload() { data, context }: Actions.Response.CreateOne.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.Response.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast(authMeta, [{ ...data, assistantID: context.assistantID, environmentID: context.environmentID }])
      .then(([result]) => ({ data: this.entitySerializer.nullable(result), context }));
  }

  @Action(Actions.Response.PatchOne)
  @Authorize.Permissions<Actions.Response.PatchOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Response.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.Response.PatchOne, @AuthMeta() authMeta: AuthMetaPayload) {
    await this.service.patchOneForUser(authMeta.userID, { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.Response.PatchMany)
  @Authorize.Permissions<Actions.Response.PatchMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Response.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.Response.PatchMany, @AuthMeta() authMeta: AuthMetaPayload) {
    await this.service.patchManyForUser(
      authMeta.userID,
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.Response.DeleteOne)
  @Authorize.Permissions<Actions.Response.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Response.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.Response.DeleteOne, @AuthMeta() authMeta: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([{ id, environmentID: context.environmentID }]);

    // overriding responses cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(authMeta, { ...result, delete: { ...result.delete, responses: [] } });
  }

  @Action(Actions.Response.DeleteMany)
  @Authorize.Permissions<Actions.Response.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Response.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.Response.DeleteMany, @AuthMeta() authMeta: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids.map((id) => ({ id, environmentID: context.environmentID })));

    // overriding responses cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(authMeta, { ...result, delete: { ...result.delete, responses: [] } });
  }

  @Action(Actions.Response.AddOne)
  @Authorize.Permissions<Actions.Response.AddOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Response.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.Response.AddOne) {
    // broadcast only
  }

  @Action(Actions.Response.AddMany)
  @Authorize.Permissions<Actions.Response.AddMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Response.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.Response.AddMany) {
    // broadcast only
  }
}
