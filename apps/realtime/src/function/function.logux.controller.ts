import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { FunctionService } from './function.service';

@Controller()
@InjectRequestContext()
export class FunctionLoguxController {
  constructor(
    @Inject(FunctionService)
    private readonly service: FunctionService
  ) {}

  @Action.Async(Actions.Function.CreateOne)
  @Authorize.Permissions<Actions.Function.CreateOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async createOne(
    @Payload() { data, context }: Actions.Function.CreateOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Function.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast([data], { auth, context })
      .then(([result]) => ({ data: this.service.toJSON(result), context }));
  }

  @Action.Async(Actions.Function.DuplicateOne)
  @Authorize.Permissions<Actions.Function.DuplicateOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async duplicateOne(
    @Payload() { data, context }: Actions.Function.DuplicateOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Function.DuplicateOne.Response> {
    return this.service
      .duplicateManyAndBroadcast([data.functionID], { auth, context })
      .then(([result]) => ({ data: { functionResource: this.service.toJSON(result) }, context }));
  }

  @Action(Actions.Function.PatchOne)
  @Authorize.Permissions<Actions.Function.PatchOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Function.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.Function.PatchOne, @AuthMeta() auth: AuthMetaPayload) {
    await this.service.patchOneForUser(auth.userID, { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.Function.PatchMany)
  @Authorize.Permissions<Actions.Function.PatchMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Function.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.Function.PatchMany, @AuthMeta() auth: AuthMetaPayload) {
    await this.service.patchManyForUser(
      auth.userID,
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.Function.DeleteOne)
  @Authorize.Permissions<Actions.Function.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Function.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.Function.DeleteOne, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([id], context);

    // overriding functions cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(
      { ...result, delete: { ...result.delete, functions: [] } },
      { auth, context }
    );
  }

  @Action(Actions.Function.DeleteMany)
  @Authorize.Permissions<Actions.Function.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Function.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.Function.DeleteMany, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids, context);

    // overriding functions cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(
      { ...result, delete: { ...result.delete, functions: [] } },
      { auth, context }
    );
  }

  @Action(Actions.Function.AddOne)
  @Broadcast<Actions.Function.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.Function.AddOne) {
    // broadcast only
  }

  @Action(Actions.Function.AddMany)
  @Broadcast<Actions.Function.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.Function.AddMany) {
    // broadcast only
  }

  @Action.Async(Actions.Function.CreateOneFromTemplate)
  @Authorize.Permissions<Actions.Function.CreateOneFromTemplate.Request>(
    [Permission.PROJECT_UPDATE],
    ({ context }) => ({
      id: context.environmentID,
      kind: 'version',
    })
  )
  @UseRequestContext()
  async createOneFromTemplate(
    @Payload() { data, context }: Actions.Function.CreateOneFromTemplate.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.Function.CreateOneFromTemplate.Response> {
    const createdFunction = await this.service.createOneFromTemplateAndBroadcast({
      data,
      userID: authMeta.userID,
      clientID: authMeta.clientID,
      environmentID: context.environmentID,
    });

    return {
      data: this.service.toJSON(createdFunction),
      context,
    };
  }
}
