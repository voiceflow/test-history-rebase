import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, type AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { FunctionVariableService } from './function-variable.service';

@Controller()
@InjectRequestContext()
export class FunctionVariableLoguxController {
  constructor(
    @Inject(FunctionVariableService)
    private readonly service: FunctionVariableService
  ) {}

  @Action.Async(Actions.FunctionVariable.CreateOne)
  @Authorize.Permissions<Actions.FunctionVariable.CreateOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async createOne(
    @Payload() { data, context }: Actions.FunctionVariable.CreateOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.FunctionVariable.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast([data], { auth, context })
      .then(([result]) => ({ data: this.service.toJSON(result), context }));
  }

  @Action(Actions.FunctionVariable.PatchOne)
  @Authorize.Permissions<Actions.FunctionVariable.PatchOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.FunctionVariable.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(
    @Payload() { id, patch, context }: Actions.FunctionVariable.PatchOne,
    @AuthMeta() auth: AuthMetaPayload
  ) {
    await this.service.patchOneForUser(auth.userID, { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.FunctionVariable.PatchMany)
  @Authorize.Permissions<Actions.FunctionVariable.PatchMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.FunctionVariable.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(
    @Payload() { ids, patch, context }: Actions.FunctionVariable.PatchMany,
    @AuthMeta() auth: AuthMetaPayload
  ) {
    await this.service.patchManyForUser(
      auth.userID,
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.FunctionVariable.DeleteOne)
  @Authorize.Permissions<Actions.FunctionVariable.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.FunctionVariable.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.FunctionVariable.DeleteOne, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([id], context);

    // overriding functions cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(
      { ...result, delete: { ...result.delete, functionVariables: [] } },
      { auth, context }
    );
  }

  @Action(Actions.FunctionVariable.DeleteMany)
  @Authorize.Permissions<Actions.FunctionVariable.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.FunctionVariable.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(
    @Payload() { ids, context }: Actions.FunctionVariable.DeleteMany,
    @AuthMeta() auth: AuthMetaPayload
  ) {
    const result = await this.service.deleteManyAndSync(ids, context);

    // overriding functions cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(
      { ...result, delete: { ...result.delete, functionVariables: [] } },
      { auth, context }
    );
  }

  @Action(Actions.FunctionVariable.AddOne)
  @Broadcast<Actions.FunctionVariable.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.FunctionVariable.AddOne) {
    // broadcast only
  }

  @Action(Actions.FunctionVariable.AddMany)
  @Broadcast<Actions.FunctionVariable.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.FunctionVariable.AddMany) {
    // broadcast only
  }
}
