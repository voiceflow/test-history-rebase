import type { MikroORM } from '@mikro-orm/core';
import { UseRequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, EntitySerializer } from '@/common';

import { UtteranceService } from './utterance.service';

@Controller()
export class UtteranceLoguxController {
  constructor(
    @Inject(getMikroORMToken(DatabaseTarget.POSTGRES))
    private readonly orm: MikroORM,
    @Inject(UtteranceService)
    private readonly service: UtteranceService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  @Action.Async(Actions.Utterance.CreateOne)
  @UseRequestContext()
  create(@Payload() { data, context }: Actions.Utterance.CreateOne.Request): Promise<Actions.Utterance.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast([{ ...data, assistantID: context.assistantID, environmentID: context.environmentID }])
      .then(([result]) => ({ data: this.entitySerializer.nullable(result), context }));
  }

  @Action.Async(Actions.Utterance.CreateMany)
  @UseRequestContext()
  createMany(@Payload() { data, context }: Actions.Utterance.CreateMany.Request): Promise<Actions.Utterance.CreateMany.Response> {
    return this.service
      .createManyAndBroadcast(data.map((item) => ({ ...item, assistantID: context.assistantID, environmentID: context.environmentID })))
      .then((result) => ({ data: this.entitySerializer.iterable(result), context }));
  }

  @Action(Actions.Utterance.PatchOne)
  @Broadcast<Actions.Utterance.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.Utterance.PatchOne) {
    await this.service.patchOne({ id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.Utterance.PatchMany)
  @Broadcast<Actions.Utterance.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.Utterance.PatchMany) {
    await this.service.patchMany(
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.Utterance.DeleteOne)
  @Broadcast<Actions.Utterance.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.Utterance.DeleteOne) {
    await this.service.deleteOne({ id, environmentID: context.environmentID });
  }

  @Action(Actions.Utterance.DeleteMany)
  @Broadcast<Actions.Utterance.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.Utterance.DeleteMany) {
    await this.service.deleteMany(ids.map((id) => ({ id, environmentID: context.environmentID })));
  }

  @Action(Actions.Utterance.AddOne)
  @Broadcast<Actions.Utterance.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.Utterance.AddOne) {
    // broadcast only
  }

  @Action(Actions.Utterance.AddMany)
  @Broadcast<Actions.Utterance.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.Utterance.AddMany) {
    // broadcast only
  }
}
