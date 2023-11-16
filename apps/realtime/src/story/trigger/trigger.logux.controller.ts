import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import type { EventTriggerEntity, IntentTriggerEntity } from '@voiceflow/orm-designer';
import { TriggerTarget } from '@voiceflow/orm-designer';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, EntitySerializer, InjectRequestContext, UseRequestContext } from '@/common';

import { TriggerService } from './trigger.service';

@Controller()
@InjectRequestContext()
export class TriggerLoguxController {
  constructor(
    @Inject(TriggerService)
    private readonly service: TriggerService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  @Action.Async(Actions.Trigger.CreateOneEvent)
  @Authorize.Permissions<Actions.Trigger.CreateOneEvent.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async createOneEvent(
    @Payload() { data, context }: Actions.Trigger.CreateOneEvent.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.Trigger.CreateOneEvent.Response> {
    return this.service
      .createManyAndBroadcast(authMeta, [
        { ...data, target: TriggerTarget.EVENT, assistantID: context.assistantID, environmentID: context.environmentID },
      ])
      .then(([result]) => ({ data: this.entitySerializer.serialize(result as EventTriggerEntity), context }));
  }

  @Action.Async(Actions.Trigger.CreateOneIntent)
  @Authorize.Permissions<Actions.Trigger.CreateOneIntent.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async createOneIntent(
    @Payload() { data, context }: Actions.Trigger.CreateOneIntent.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.Trigger.CreateOneIntent.Response> {
    return this.service
      .createManyAndBroadcast(authMeta, [
        { ...data, target: TriggerTarget.INTENT, assistantID: context.assistantID, environmentID: context.environmentID },
      ])
      .then(([result]) => ({ data: this.entitySerializer.serialize(result as IntentTriggerEntity), context }));
  }

  @Action(Actions.Trigger.PatchOne)
  @Authorize.Permissions<Actions.Trigger.PatchOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Trigger.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.Trigger.PatchOne) {
    await this.service.patchOne({ id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.Trigger.PatchMany)
  @Authorize.Permissions<Actions.Trigger.PatchMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Trigger.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.Trigger.PatchMany) {
    await this.service.patchMany(
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.Trigger.DeleteOne)
  @Authorize.Permissions<Actions.Trigger.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Trigger.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.Trigger.DeleteOne, @AuthMeta() authMeta: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([{ id, environmentID: context.environmentID }]);

    // overriding triggers cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(authMeta, { ...result, delete: { ...result.delete, triggers: [] } });
  }

  @Action(Actions.Trigger.DeleteMany)
  @Authorize.Permissions<Actions.Trigger.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Trigger.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.Trigger.DeleteMany, @AuthMeta() authMeta: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids.map((id) => ({ id, environmentID: context.environmentID })));

    // overriding triggers cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(authMeta, { ...result, delete: { ...result.delete, triggers: [] } });
  }

  @Action(Actions.Trigger.AddOne)
  @Authorize.Permissions<Actions.Trigger.AddOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Trigger.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.Trigger.AddOne) {
    // broadcast only
  }

  @Action(Actions.Trigger.AddMany)
  @Authorize.Permissions<Actions.Trigger.AddMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Trigger.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.Trigger.AddMany) {
    // broadcast only
  }
}
