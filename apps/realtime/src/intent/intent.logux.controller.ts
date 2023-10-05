import type { MikroORM } from '@mikro-orm/core';
import { UseRequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, Broadcast, Context, Payload } from '@voiceflow/nestjs-logux';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, EntitySerializer } from '@/common';

import { IntentService } from './intent.service';

@Controller()
export class IntentLoguxController {
  constructor(
    @Inject(getMikroORMToken(DatabaseTarget.POSTGRES))
    private readonly orm: MikroORM,
    @Inject(IntentService)
    private readonly service: IntentService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  @Action.Async(Actions.Intent.CreateOne)
  @UseRequestContext()
  create(@Context() ctx: Context.Action, @Payload() { context, data }: Actions.Intent.CreateOne.Request): Promise<Actions.Intent.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast(Number(ctx.userId), [{ ...data, assistantID: context.assistantID, environmentID: context.environmentID }])
      .then(([result]) => ({ data: this.entitySerializer.nullable(result), context }));
  }

  @Action(Actions.Intent.PatchOne)
  @Broadcast<Actions.Intent.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.Intent.PatchOne, @Context() ctx: Context.Action) {
    await this.service.patchOneForUser(Number(ctx.userId), { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.Intent.PatchMany)
  @Broadcast<Actions.Intent.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.Intent.PatchMany, @Context() ctx: Context.Action) {
    await this.service.patchManyForUser(
      Number(ctx.userId),
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.Intent.DeleteOne)
  @Broadcast<Actions.Intent.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.Intent.DeleteOne) {
    const result = await this.service.deleteManyAndSync([{ id, environmentID: context.environmentID }]);

    // overriding intents cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, intents: [] } });
  }

  @Action(Actions.Intent.DeleteMany)
  @Broadcast<Actions.Intent.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.Intent.DeleteMany) {
    const result = await this.service.deleteManyAndSync(ids.map((id) => ({ id, environmentID: context.environmentID })));

    // overriding intents cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, intents: [] } });
  }

  @Action(Actions.Intent.AddOne)
  @Broadcast<Actions.Intent.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.Intent.AddOne) {
    // broadcast only
  }

  @Action(Actions.Intent.AddMany)
  @Broadcast<Actions.Intent.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.Intent.AddMany) {
    // broadcast only
  }
}
