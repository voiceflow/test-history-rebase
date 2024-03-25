import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { ResponseService } from './response.service';

@Controller()
@InjectRequestContext()
export class ResponseLoguxController {
  constructor(
    @Inject(ResponseService)
    private readonly service: ResponseService
  ) {}

  @Action.Async(Actions.Response.CreateOne)
  @Authorize.Permissions<Actions.Response.CreateOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createOne(
    @Payload() { data, context }: Actions.Response.CreateOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Response.CreateOne.Response> {
    return this.service.createManyAndBroadcast([data], { auth, context }).then(([result]) => ({ data: this.service.toJSON(result), context }));
  }

  @Action.Async(Actions.Response.CreateMany)
  @Authorize.Permissions<Actions.Response.CreateMany.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createMany(
    @Payload() { data, context }: Actions.Response.CreateMany.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Response.CreateMany.Response> {
    return this.service.createManyAndBroadcast(data, { auth, context }).then((result) => ({ data: this.service.mapToJSON(result), context }));
  }

  @Action(Actions.Response.PatchOne)
  @Authorize.Permissions<Actions.Response.PatchOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Response.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.Response.PatchOne, @AuthMeta() auth: AuthMetaPayload) {
    await this.service.patchOneForUser(auth.userID, { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.Response.PatchMany)
  @Authorize.Permissions<Actions.Response.PatchMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Response.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.Response.PatchMany, @AuthMeta() auth: AuthMetaPayload) {
    await this.service.patchManyForUser(
      auth.userID,
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
  async deleteOne(@Payload() { id, context }: Actions.Response.DeleteOne, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([id], { userID: auth.userID, context });

    // overriding responses cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, responses: [] } }, { auth, context });
  }

  @Action(Actions.Response.DeleteMany)
  @Authorize.Permissions<Actions.Response.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Response.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.Response.DeleteMany, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids, { userID: auth.userID, context });

    // overriding responses cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, responses: [] } }, { auth, context });
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
