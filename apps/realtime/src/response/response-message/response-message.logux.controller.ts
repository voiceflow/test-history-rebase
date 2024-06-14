import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { ResponseMessageLoguxService } from './response-message.logux.service';
import { ResponseMessageRepository } from './response-message.repository';
import { ResponseMessageSerializer } from './response-message.serializer';
import { ResponseMessageService } from './response-message.service';

@Controller()
@InjectRequestContext()
export class ResponseVariantLoguxController {
  constructor(
    @Inject(ResponseMessageService)
    private readonly service: ResponseMessageService,
    @Inject(ResponseMessageSerializer)
    private readonly serializer: ResponseMessageSerializer,
    @Inject(ResponseMessageRepository)
    private readonly repository: ResponseMessageRepository,
    @Inject(ResponseMessageLoguxService)
    private readonly logux: ResponseMessageLoguxService
  ) {}

  @Action.Async(Actions.ResponseMessage.CreateOne)
  @Authorize.Permissions<Actions.ResponseMessage.CreateOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createOne(
    @Payload() { data, context, options }: Actions.ResponseMessage.CreateOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.ResponseMessage.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast([data], { ...options, auth, context })
      .then(([result]) => ({ data: this.serializer.serialize(result), context }));
  }

  @Action.Async(Actions.ResponseMessage.CreateMany)
  @Authorize.Permissions<Actions.ResponseMessage.CreateMany.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createMany(
    @Payload() { data, context, options }: Actions.ResponseMessage.CreateMany.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.ResponseMessage.CreateMany.Response> {
    return this.service
      .createManyAndBroadcast(data, { ...options, auth, context })
      .then((result) => ({ data: this.serializer.iterable(result), context }));
  }

  @Action(Actions.ResponseMessage.PatchOne)
  @Authorize.Permissions<Actions.ResponseMessage.PatchOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseMessage.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(
    @Payload() { id, patch, context }: Actions.ResponseMessage.PatchOne,
    @AuthMeta() auth: AuthMetaPayload
  ) {
    await this.repository.patchOneForUser(auth.userID, { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.ResponseMessage.PatchMany)
  @Authorize.Permissions<Actions.ResponseMessage.PatchMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseMessage.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(
    @Payload() { ids, patch, context }: Actions.ResponseMessage.PatchMany,
    @AuthMeta() auth: AuthMetaPayload
  ) {
    await this.repository.patchManyForUser(
      auth.userID,
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.ResponseMessage.DeleteOne)
  @Authorize.Permissions<Actions.ResponseMessage.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseMessage.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.ResponseMessage.DeleteOne, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([id], { userID: auth.userID, context });

    await this.logux.broadcastDeleteMany(
      { ...result, delete: { ...result.delete, responseMessages: [] } },
      { auth, context }
    );
  }

  @Action(Actions.ResponseMessage.DeleteMany)
  @Authorize.Permissions<Actions.ResponseMessage.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseMessage.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.ResponseMessage.DeleteMany, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids, { userID: auth.userID, context });

    await this.logux.broadcastDeleteMany(
      { ...result, delete: { ...result.delete, responseMessages: [] } },
      { auth, context }
    );
  }

  @Action(Actions.ResponseMessage.AddOne)
  @Authorize.Permissions<Actions.ResponseMessage.AddOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseMessage.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.ResponseDiscriminator.AddOne) {
    // broadcast only
  }

  @Action(Actions.ResponseMessage.AddMany)
  @Authorize.Permissions<Actions.ResponseMessage.AddMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseMessage.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.ResponseMessage.AddMany) {
    // broadcast only
  }
}
