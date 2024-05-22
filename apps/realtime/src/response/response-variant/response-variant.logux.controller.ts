import { Controller, Inject } from '@nestjs/common';
import { ResponseVariantType, TextResponseVariant } from '@voiceflow/dtos';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { ResponseTextVariantService } from './response-text-variant.service';
import { ResponseVariantService } from './response-variant.service';

@Controller()
@InjectRequestContext()
export class ResponseVariantLoguxController {
  constructor(
    @Inject(ResponseVariantService)
    private readonly service: ResponseVariantService,
    @Inject(ResponseTextVariantService)
    private readonly responseTextVariant: ResponseTextVariantService
  ) {}

  @Action.Async(Actions.ResponseVariant.CreateTextOne)
  @Authorize.Permissions<Actions.ResponseVariant.CreateTextOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createTextOne(
    @Payload() { data, context, options }: Actions.ResponseVariant.CreateTextOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.ResponseVariant.CreateTextOne.Response> {
    return this.service
      .createManyAndBroadcast([{ ...data, type: ResponseVariantType.TEXT }], { ...options, auth, context })
      .then(([result]) => ({ data: this.service.toJSON(result) as TextResponseVariant, context }));
  }

  @Action.Async(Actions.ResponseVariant.CreateTextMany)
  @Authorize.Permissions<Actions.ResponseVariant.CreateTextMany.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createTextMany(
    @Payload() { data, context, options }: Actions.ResponseVariant.CreateTextMany.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.ResponseVariant.CreateTextMany.Response> {
    return this.service
      .createManyAndBroadcast(
        data.map((item) => ({ ...item, type: ResponseVariantType.TEXT })),
        { ...options, auth, context }
      )
      .then((result) => ({ data: this.service.mapToJSON(result) as TextResponseVariant[], context }));
  }

  @Action(Actions.ResponseVariant.PatchOneText)
  @Authorize.Permissions<Actions.ResponseVariant.PatchOneText>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseVariant.PatchOneText>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOneText(@Payload() { id, patch, context }: Actions.ResponseVariant.PatchOneText, @AuthMeta() auth: AuthMetaPayload) {
    await this.responseTextVariant.patchOneForUser(auth.userID, { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.ResponseVariant.PatchManyText)
  @Authorize.Permissions<Actions.ResponseVariant.PatchManyText>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseVariant.PatchManyText>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchManyText(@Payload() { ids, patch, context }: Actions.ResponseVariant.PatchManyText, @AuthMeta() auth: AuthMetaPayload) {
    await this.responseTextVariant.patchManyForUser(
      auth.userID,
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.ResponseVariant.DeleteOne)
  @Authorize.Permissions<Actions.ResponseVariant.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseVariant.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.ResponseVariant.DeleteOne, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([id], { userID: auth.userID, context });

    // overriding variants cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, responseVariants: [] } }, { auth, context });
  }

  @Action(Actions.ResponseVariant.DeleteMany)
  @Authorize.Permissions<Actions.ResponseVariant.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseVariant.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.ResponseVariant.DeleteMany, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids, { userID: auth.userID, context });

    // overriding variants cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, responseVariants: [] } }, { auth, context });
  }

  // no need to broadcast, cause it doesn't affect client state
  @Action(Actions.ResponseVariant.ReplaceWithType)
  @Authorize.Permissions<Actions.ResponseVariant.ReplaceWithType>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async replaceWithType(@Payload() { id, type, context }: Actions.ResponseVariant.ReplaceWithType, @AuthMeta() auth: AuthMetaPayload) {
    await this.service.replaceOneWithTypeAndBroadcast({ id, type }, { auth, context });
  }

  @Action(Actions.ResponseVariant.PatchOne)
  @Authorize.Permissions<Actions.ResponseVariant.PatchOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseVariant.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() _: Actions.ResponseVariant.PatchOne) {
    // broadcast only
  }

  @Action(Actions.ResponseVariant.PatchMany)
  @Authorize.Permissions<Actions.ResponseVariant.PatchMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseVariant.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() _: Actions.ResponseVariant.PatchMany) {
    // broadcast only
  }

  @Action(Actions.ResponseVariant.AddOne)
  @Authorize.Permissions<Actions.ResponseVariant.AddOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseVariant.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.ResponseDiscriminator.AddOne) {
    // broadcast only
  }

  @Action(Actions.ResponseVariant.AddMany)
  @Authorize.Permissions<Actions.ResponseVariant.AddMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseVariant.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.ResponseVariant.AddMany) {
    // broadcast only
  }
}
