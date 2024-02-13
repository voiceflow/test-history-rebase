import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, EntitySerializer, InjectRequestContext, UseRequestContext } from '@/common';

import { FolderService } from './folder.service';

@Controller()
@InjectRequestContext()
export class FolderLoguxController {
  constructor(
    @Inject(FolderService)
    private readonly service: FolderService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  @Action.Async(Actions.Folder.CreateOne)
  @Authorize.Permissions<Actions.Folder.CreateOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createOne(
    @Payload() { data, context }: Actions.Folder.CreateOne.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.Folder.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast(authMeta, [{ ...data, assistantID: context.assistantID, environmentID: context.environmentID }])
      .then(([result]) => ({ data: this.entitySerializer.nullable(result), context }));
  }

  @Action.Async(Actions.Folder.CreateMany)
  @Authorize.Permissions<Actions.Folder.CreateMany.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createMany(
    @Payload() { data, context }: Actions.Folder.CreateMany.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.Folder.CreateMany.Response> {
    return this.service
      .createManyAndBroadcast(
        authMeta,
        data.map((item) => ({ ...item, system: null, assistantID: context.assistantID, environmentID: context.environmentID }))
      )
      .then((results) => ({ data: this.entitySerializer.iterable(results), context }));
  }

  @Action(Actions.Folder.PatchOne)
  @Authorize.Permissions<Actions.Folder.PatchOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Folder.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.Folder.PatchOne, @AuthMeta() authMeta: AuthMetaPayload) {
    await this.service.patchOneForUser(authMeta.userID, { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.Folder.PatchMany)
  @Authorize.Permissions<Actions.Folder.PatchMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Folder.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.Folder.PatchMany, @AuthMeta() authMeta: AuthMetaPayload) {
    await this.service.patchManyForUser(
      authMeta.userID,
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.Folder.DeleteOne)
  @Authorize.Permissions<Actions.Folder.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Folder.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.Folder.DeleteOne, @AuthMeta() authMeta: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([{ id, environmentID: context.environmentID }]);

    // overriding folders cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(authMeta, { ...result, delete: { ...result.delete, folders: [] } });
  }

  @Action(Actions.Folder.DeleteMany)
  @Authorize.Permissions<Actions.Folder.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Folder.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.Folder.DeleteMany, @AuthMeta() authMeta: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids.map((id) => ({ id, environmentID: context.environmentID })));

    // overriding folders cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(authMeta, { ...result, delete: { ...result.delete, folders: [] } });
  }

  @Action(Actions.Folder.AddOne)
  @Authorize.Permissions<Actions.Folder.AddOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Folder.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.Folder.AddOne) {
    // for broadcast only
  }

  @Action(Actions.Folder.AddMany)
  @Authorize.Permissions<Actions.Folder.AddMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Folder.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.Folder.AddMany) {
    // for broadcast only
  }
}
