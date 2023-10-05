import type { MikroORM } from '@mikro-orm/core';
import { UseRequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, Broadcast, Context, Payload } from '@voiceflow/nestjs-logux';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, EntitySerializer } from '@/common';

import { ResponseService } from './response.service';

@Controller()
export class ResponseLoguxController {
  constructor(
    @Inject(getMikroORMToken(DatabaseTarget.POSTGRES))
    private readonly orm: MikroORM,
    @Inject(ResponseService)
    private readonly service: ResponseService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  @Action.Async(Actions.Response.CreateOne)
  @UseRequestContext()
  createOne(
    @Payload() { data, context }: Actions.Response.CreateOne.Request,
    @Context() ctx: Context.Action
  ): Promise<Actions.Response.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast(Number(ctx.userId), [{ ...data, assistantID: context.assistantID, environmentID: context.environmentID }])
      .then(([result]) => ({ data: this.entitySerializer.nullable(result), context }));
  }

  @Action(Actions.Response.PatchOne)
  @Broadcast<Actions.Response.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.Response.PatchOne, @Context() ctx: Context.Action) {
    await this.service.patchOneForUser(Number(ctx.userId), { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.Response.PatchMany)
  @Broadcast<Actions.Response.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.Response.PatchMany, @Context() ctx: Context.Action) {
    await this.service.patchManyForUser(
      Number(ctx.userId),
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.Response.DeleteOne)
  @Broadcast<Actions.Response.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.Response.DeleteOne) {
    const result = await this.service.deleteManyAndSync([{ id, environmentID: context.environmentID }]);

    // overriding responses cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, responses: [] } });
  }

  @Action(Actions.Response.DeleteMany)
  @Broadcast<Actions.Response.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.Response.DeleteMany) {
    const result = await this.service.deleteManyAndSync(ids.map((id) => ({ id, environmentID: context.environmentID })));

    // overriding responses cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, responses: [] } });
  }

  @Action(Actions.Response.AddOne)
  @Broadcast<Actions.Response.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.Response.AddOne) {
    // broadcast only
  }

  @Action(Actions.Response.AddMany)
  @Broadcast<Actions.Response.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.Response.AddMany) {
    // broadcast only
  }
}
