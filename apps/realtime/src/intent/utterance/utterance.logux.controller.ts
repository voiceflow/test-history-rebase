import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { UtteranceService } from './utterance.service';

@Controller()
@InjectRequestContext()
export class UtteranceLoguxController {
  constructor(
    @Inject(UtteranceService)
    private readonly service: UtteranceService
  ) {}

  @Action.Async(Actions.Utterance.CreateOne)
  @Authorize.Permissions<Actions.Utterance.CreateOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  create(
    @Payload() { data, context }: Actions.Utterance.CreateOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Utterance.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast([data], { auth, context })
      .then(([result]) => ({ data: this.service.toJSON(result), context }));
  }

  @Action.Async(Actions.Utterance.CreateMany)
  @Authorize.Permissions<Actions.Utterance.CreateMany.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createMany(
    @Payload() { data, context }: Actions.Utterance.CreateMany.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Utterance.CreateMany.Response> {
    return this.service
      .createManyAndBroadcast(data, { auth, context })
      .then((result) => ({ data: this.service.mapToJSON(result), context }));
  }

  @Action(Actions.Utterance.PatchOne)
  @Authorize.Permissions<Actions.Utterance.PatchOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Utterance.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.Utterance.PatchOne, @AuthMeta() auth: AuthMetaPayload) {
    await this.service.patchOneForUser(auth.userID, { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.Utterance.PatchMany)
  @Authorize.Permissions<Actions.Utterance.PatchMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Utterance.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.Utterance.PatchMany, @AuthMeta() auth: AuthMetaPayload) {
    await this.service.patchManyForUser(
      auth.userID,
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.Utterance.DeleteOne)
  @Authorize.Permissions<Actions.Utterance.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Utterance.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.Utterance.DeleteOne, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([id], context);

    // overriding utterances cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(
      { ...result, delete: { ...result.delete, utterances: [] } },
      { auth, context }
    );
  }

  @Action(Actions.Utterance.DeleteMany)
  @Authorize.Permissions<Actions.Utterance.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Utterance.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.Utterance.DeleteMany, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids, context);

    // overriding utterances cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(
      { ...result, delete: { ...result.delete, utterances: [] } },
      { auth, context }
    );
  }

  @Action(Actions.Utterance.AddOne)
  @Authorize.Permissions<Actions.Utterance.AddOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Utterance.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.Utterance.AddOne) {
    // broadcast only
  }

  @Action(Actions.Utterance.AddMany)
  @Authorize.Permissions<Actions.Utterance.AddMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Utterance.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.Utterance.AddMany) {
    // broadcast only
  }
}
