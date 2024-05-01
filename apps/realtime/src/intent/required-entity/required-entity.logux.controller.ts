import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, type AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { RequiredEntityService } from './required-entity.service';

@Controller()
@InjectRequestContext()
export class RequiredEntityLoguxController {
  constructor(
    @Inject(RequiredEntityService)
    private readonly service: RequiredEntityService
  ) {}

  @Action.Async(Actions.RequiredEntity.CreateOne)
  @Authorize.Permissions<Actions.RequiredEntity.CreateOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  create(
    @Payload() { data, context }: Actions.RequiredEntity.CreateOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.RequiredEntity.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast([data], { auth, context })
      .then(([result]) => ({ data: this.service.toJSON(result), context }));
  }

  @Action.Async(Actions.RequiredEntity.CreateMany)
  @Authorize.Permissions<Actions.RequiredEntity.CreateMany.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async createMany(
    @Payload() { data, context }: Actions.RequiredEntity.CreateMany.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.RequiredEntity.CreateMany.Response> {
    return this.service
      .createManyAndBroadcast(data, { auth, context })
      .then((result) => ({ data: this.service.mapToJSON(result), context }));
  }

  @Action(Actions.RequiredEntity.PatchOne)
  @Authorize.Permissions<Actions.RequiredEntity.PatchOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.RequiredEntity.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(
    @Payload() { id, patch, context }: Actions.RequiredEntity.PatchOne,
    @AuthMeta() auth: AuthMetaPayload
  ) {
    await this.service.patchOneForUser(auth.userID, { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.RequiredEntity.PatchMany)
  @Authorize.Permissions<Actions.RequiredEntity.PatchMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.RequiredEntity.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(
    @Payload() { ids, patch, context }: Actions.RequiredEntity.PatchMany,
    @AuthMeta() auth: AuthMetaPayload
  ) {
    await this.service.patchManyForUser(
      auth.userID,
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.RequiredEntity.DeleteOne)
  @Authorize.Permissions<Actions.RequiredEntity.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.RequiredEntity.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.RequiredEntity.DeleteOne, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([id], { userID: auth.userID, context });

    // overriding requiredEntities cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(
      { ...result, delete: { ...result.delete, requiredEntities: [] } },
      { auth, context }
    );
  }

  @Action(Actions.RequiredEntity.DeleteMany)
  @Authorize.Permissions<Actions.RequiredEntity.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.RequiredEntity.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.RequiredEntity.DeleteMany, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids, { userID: auth.userID, context });

    // overriding requiredEntities cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(
      { ...result, delete: { ...result.delete, requiredEntities: [] } },
      { auth, context }
    );
  }

  @Action(Actions.RequiredEntity.AddOne)
  @Authorize.Permissions<Actions.RequiredEntity.AddOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.RequiredEntity.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.RequiredEntity.AddOne) {
    // broadcast only
  }

  @Action(Actions.RequiredEntity.AddMany)
  @Authorize.Permissions<Actions.RequiredEntity.AddMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.RequiredEntity.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.RequiredEntity.AddMany) {
    // broadcast only
  }
}
