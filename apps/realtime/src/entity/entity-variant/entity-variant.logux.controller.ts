import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { EntityVariantService } from './entity-variant.service';

@Controller()
@InjectRequestContext()
export class EntityVariantLoguxController {
  constructor(
    @Inject(EntityVariantService)
    private readonly service: EntityVariantService
  ) {}

  @Action.Async(Actions.EntityVariant.CreateOne)
  @Authorize.Permissions<Actions.EntityVariant.CreateOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createOne(
    @Payload() { data, context }: Actions.EntityVariant.CreateOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.EntityVariant.CreateOne.Response> {
    return this.service.createManyAndBroadcast([data], { auth, context }).then(([result]) => ({ data: this.service.toJSON(result), context }));
  }

  @Action.Async(Actions.EntityVariant.CreateMany)
  @Authorize.Permissions<Actions.EntityVariant.CreateMany.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createMany(
    @Payload() { data, context }: Actions.EntityVariant.CreateMany.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.EntityVariant.CreateMany.Response> {
    return this.service.createManyAndBroadcast(data, { auth, context }).then((result) => ({ data: this.service.mapToJSON(result), context }));
  }

  @Action(Actions.EntityVariant.PatchOne)
  @Authorize.Permissions<Actions.EntityVariant.PatchOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.EntityVariant.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.EntityVariant.PatchOne, @AuthMeta() auth: AuthMetaPayload) {
    await this.service.patchOneForUser(auth.userID, { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.EntityVariant.PatchMany)
  @Authorize.Permissions<Actions.EntityVariant.PatchMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.EntityVariant.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.EntityVariant.PatchMany, @AuthMeta() auth: AuthMetaPayload) {
    await this.service.patchManyForUser(
      auth.userID,
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.EntityVariant.DeleteOne)
  @Authorize.Permissions<Actions.EntityVariant.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.EntityVariant.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.EntityVariant.DeleteOne, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([id], context);

    // overriding entity variants cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, entityVariants: [] } }, { auth, context });
  }

  @Action(Actions.EntityVariant.DeleteMany)
  @Authorize.Permissions<Actions.EntityVariant.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.EntityVariant.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.EntityVariant.DeleteMany, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids, context);

    // overriding entity variants cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, entityVariants: [] } }, { auth, context });
  }

  @Action(Actions.EntityVariant.AddOne)
  @Authorize.Permissions<Actions.EntityVariant.AddOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.EntityVariant.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.EntityVariant.AddOne) {
    // for broadcast only
  }

  @Action(Actions.EntityVariant.AddMany)
  @Authorize.Permissions<Actions.EntityVariant.AddMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.EntityVariant.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.EntityVariant.AddMany) {
    // for broadcast only
  }
}
