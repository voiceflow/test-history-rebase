import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { ResponseDiscriminatorService } from './response-discriminator.service';

@Controller()
@InjectRequestContext()
export class ResponseDiscriminatorLoguxController {
  constructor(
    @Inject(ResponseDiscriminatorService)
    private readonly service: ResponseDiscriminatorService
  ) {}

  @Action.Async(Actions.ResponseDiscriminator.CreateOne)
  @Authorize.Permissions<Actions.ResponseDiscriminator.CreateOne.Request>(
    [Permission.PROJECT_UPDATE],
    ({ context }) => ({
      id: context.environmentID,
      kind: 'version',
    })
  )
  @UseRequestContext()
  async createOne(
    @Payload() { data, context }: Actions.ResponseDiscriminator.CreateOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.ResponseDiscriminator.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast([data], { auth, context })
      .then(([result]) => ({ data: this.service.toJSON(result), context }));
  }

  @Action(Actions.ResponseDiscriminator.PatchOne)
  @Authorize.Permissions<Actions.ResponseDiscriminator.PatchOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseDiscriminator.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.ResponseDiscriminator.PatchOne) {
    await this.service.patchOne({ id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.ResponseDiscriminator.PatchMany)
  @Authorize.Permissions<Actions.ResponseDiscriminator.PatchMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseDiscriminator.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.ResponseDiscriminator.PatchMany) {
    await this.service.patchMany(
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.ResponseDiscriminator.DeleteOne)
  @Authorize.Permissions<Actions.ResponseDiscriminator.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseDiscriminator.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(
    @Payload() { id, context }: Actions.ResponseDiscriminator.DeleteOne,
    @AuthMeta() auth: AuthMetaPayload
  ) {
    const result = await this.service.deleteManyAndSync([id], context);

    // overriding discriminators cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(
      { ...result, delete: { ...result.delete, responseDiscriminators: [] } },
      { auth, context }
    );
  }

  @Action(Actions.ResponseDiscriminator.DeleteMany)
  @Authorize.Permissions<Actions.ResponseDiscriminator.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseDiscriminator.DeleteMany>(({ context }) => ({
    channel: Channels.assistant.build(context),
  }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(
    @Payload() { ids, context }: Actions.ResponseDiscriminator.DeleteMany,
    @AuthMeta() auth: AuthMetaPayload
  ) {
    const result = await this.service.deleteManyAndSync(ids, context);

    // overriding discriminators cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(
      { ...result, delete: { ...result.delete, responseDiscriminators: [] } },
      { auth, context }
    );
  }

  @Action(Actions.ResponseDiscriminator.AddOne)
  @Authorize.Permissions<Actions.ResponseDiscriminator.AddOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseDiscriminator.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.ResponseDiscriminator.AddOne) {
    // broadcast only
  }

  @Action(Actions.ResponseDiscriminator.AddMany)
  @Authorize.Permissions<Actions.ResponseDiscriminator.AddMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseDiscriminator.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.ResponseDiscriminator.AddMany) {
    // broadcast only
  }
}
