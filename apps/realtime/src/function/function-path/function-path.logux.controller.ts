import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { FunctionPathService } from './function-path.service';

@Controller()
@InjectRequestContext()
export class FunctionPathLoguxController {
  constructor(
    @Inject(FunctionPathService)
    private readonly service: FunctionPathService
  ) { }

  @Action.Async(Actions.FunctionPath.CreateOne)
  @Authorize.Permissions<Actions.FunctionPath.CreateOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async createOne(
    @Payload() { data, context }: Actions.FunctionPath.CreateOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.FunctionPath.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast([data], { auth, context })
      .then(([result]) => ({ data: this.service.toJSON(result), context }));
  }

  @Action(Actions.FunctionPath.PatchOne)
  @Authorize.Permissions<Actions.FunctionPath.PatchOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.FunctionPath.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.FunctionPath.PatchOne, @AuthMeta() auth: AuthMetaPayload) {
    await this.service.patchOneForUser(auth.userID, { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.FunctionPath.PatchMany)
  @Authorize.Permissions<Actions.FunctionPath.PatchMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.FunctionPath.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(
    @Payload() { ids, patch, context }: Actions.FunctionPath.PatchMany,
    @AuthMeta() auth: AuthMetaPayload
  ) {
    await this.service.patchManyForUser(
      auth.userID,
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.FunctionPath.DeleteOne)
  @Authorize.Permissions<Actions.FunctionPath.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.FunctionPath.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.FunctionPath.DeleteOne, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([id], { userID: auth.userID, context });

    // overriding functions cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(
      { ...result, delete: { ...result.delete, functionPaths: [] } },
      { auth, context }
    );
  }

  @Action(Actions.FunctionPath.DeleteMany)
  @Authorize.Permissions<Actions.FunctionPath.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.FunctionPath.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.FunctionPath.DeleteMany, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids, { userID: auth.userID, context });

    // overriding functions cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(
      { ...result, delete: { ...result.delete, functionPaths: [] } },
      { auth, context }
    );
  }

  @Action(Actions.FunctionPath.AddOne)
  @Broadcast<Actions.FunctionPath.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.FunctionPath.AddOne) {
    // broadcast only
  }

  @Action(Actions.FunctionPath.AddMany)
  @Broadcast<Actions.FunctionPath.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.FunctionPath.AddMany) {
    // broadcast only
  }
}
