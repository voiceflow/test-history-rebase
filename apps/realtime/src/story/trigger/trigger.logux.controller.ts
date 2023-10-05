import type { MikroORM } from '@mikro-orm/core';
import { UseRequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import type { EventTriggerEntity, IntentTriggerEntity } from '@voiceflow/orm-designer';
import { DatabaseTarget, TriggerTarget } from '@voiceflow/orm-designer';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, EntitySerializer } from '@/common';

import { TriggerService } from './trigger.service';

@Controller()
export class TriggerLoguxController {
  constructor(
    @Inject(getMikroORMToken(DatabaseTarget.POSTGRES))
    private readonly orm: MikroORM,
    @Inject(TriggerService)
    private readonly service: TriggerService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  @Action.Async(Actions.Trigger.CreateOneEvent)
  @UseRequestContext()
  async createOneEvent(@Payload() { data, context }: Actions.Trigger.CreateOneEvent.Request): Promise<Actions.Trigger.CreateOneEvent.Response> {
    return this.service
      .createManyAndBroadcast([{ ...data, target: TriggerTarget.EVENT, assistantID: context.assistantID, environmentID: context.environmentID }])
      .then(([result]) => ({ data: this.entitySerializer.serialize(result as EventTriggerEntity), context }));
  }

  @Action.Async(Actions.Trigger.CreateOneIntent)
  @UseRequestContext()
  async createOneIntent(@Payload() { data, context }: Actions.Trigger.CreateOneIntent.Request): Promise<Actions.Trigger.CreateOneIntent.Response> {
    return this.service
      .createManyAndBroadcast([{ ...data, target: TriggerTarget.INTENT, assistantID: context.assistantID, environmentID: context.environmentID }])
      .then(([result]) => ({ data: this.entitySerializer.serialize(result as IntentTriggerEntity), context }));
  }

  @Action(Actions.Trigger.PatchOne)
  @Broadcast<Actions.Trigger.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.Trigger.PatchOne) {
    await this.service.patchOne({ id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.Trigger.PatchMany)
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
  @Broadcast<Actions.Trigger.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.Trigger.DeleteOne) {
    const result = await this.service.deleteManyAndSync([{ id, environmentID: context.environmentID }]);

    // overriding triggers cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, triggers: [] } });
  }

  @Action(Actions.Trigger.DeleteMany)
  @Broadcast<Actions.Trigger.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.Trigger.DeleteMany) {
    const result = await this.service.deleteManyAndSync(ids.map((id) => ({ id, environmentID: context.environmentID })));

    // overriding triggers cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, triggers: [] } });
  }

  @Action(Actions.Trigger.AddOne)
  @Broadcast<Actions.Trigger.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.Trigger.AddOne) {
    // broadcast only
  }

  @Action(Actions.Trigger.AddMany)
  @Broadcast<Actions.Trigger.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.Trigger.AddMany) {
    // broadcast only
  }
}
