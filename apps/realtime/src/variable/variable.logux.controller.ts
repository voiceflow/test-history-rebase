import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { VariableService } from './variable.service';

@Controller()
@InjectRequestContext()
export class VariableLoguxController {
  constructor(
    @Inject(VariableService)
    private readonly service: VariableService
  ) {}

  @Action.Async(Actions.Variable.CreateOne)
  @Authorize.Permissions<Actions.Variable.CreateOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createOne(
    @Payload() { data, context }: Actions.Variable.CreateOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Variable.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast([{ ...data, isSystem: false }], { auth, context })
      .then(([result]) => ({ data: this.service.toJSON(result), context }));
  }

  @Action.Async(Actions.Variable.CreateMany)
  @Authorize.Permissions<Actions.Variable.CreateMany.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createMany(
    @Payload() { data, context }: Actions.Variable.CreateMany.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Variable.CreateMany.Response> {
    return this.service
      .createManyAndBroadcast(
        data.map((item) => ({ ...item, isSystem: false })),
        { auth, context }
      )
      .then((results) => ({ data: this.service.mapToJSON(results), context }));
  }

  @Action(Actions.Variable.PatchOne)
  @Authorize.Permissions<Actions.Variable.PatchOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Variable.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.Variable.PatchOne, @AuthMeta() auth: AuthMetaPayload) {
    await this.service.patchOneForUser(auth.userID, { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.Variable.PatchMany)
  @Authorize.Permissions<Actions.Variable.PatchMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Variable.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.Variable.PatchMany, @AuthMeta() auth: AuthMetaPayload) {
    await this.service.patchManyForUser(
      auth.userID,
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.Variable.DeleteOne)
  @Authorize.Permissions<Actions.Variable.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Variable.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.Variable.DeleteOne, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([id], { context });

    // overriding entities cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(
      { ...result, delete: { ...result.delete, variables: [] } },
      { auth, context }
    );
  }

  @Action(Actions.Variable.DeleteMany)
  @Authorize.Permissions<Actions.Variable.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Variable.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.Variable.DeleteMany, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids, { context });

    // overriding entities cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(
      { ...result, delete: { ...result.delete, variables: [] } },
      { auth, context }
    );
  }

  @Action(Actions.Variable.AddOne)
  @Authorize.Permissions<Actions.Variable.AddOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Variable.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.Variable.AddOne) {
    // for broadcast only
  }

  @Action(Actions.Variable.AddMany)
  @Authorize.Permissions<Actions.Variable.AddMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Variable.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.Variable.AddMany) {
    // for broadcast only
  }
}
