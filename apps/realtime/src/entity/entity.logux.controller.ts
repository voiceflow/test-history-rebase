import type { MikroORM } from '@mikro-orm/core';
import { UseRequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, Broadcast, Context, Payload } from '@voiceflow/nestjs-logux';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, EntitySerializer } from '@/common';

import { EntityService } from './entity.service';

@Controller()
export class EntityLoguxController {
  constructor(
    @Inject(getMikroORMToken(DatabaseTarget.POSTGRES))
    private readonly orm: MikroORM,
    @Inject(EntityService)
    private readonly service: EntityService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  @Action.Async(Actions.Entity.CreateOne)
  @UseRequestContext()
  createOne(
    @Payload() { data, context }: Actions.Entity.CreateOne.Request,
    @Context() ctx: Context.Action
  ): Promise<Actions.Entity.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast(Number(ctx.userId), [{ ...data, assistantID: context.assistantID, environmentID: context.environmentID }])
      .then(([result]) => ({ data: this.entitySerializer.nullable(result), context }));
  }

  @Action(Actions.Entity.PatchOne)
  @Broadcast<Actions.Entity.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.Entity.PatchOne, @Context() ctx: Context.Action) {
    await this.service.patchOneForUser(Number(ctx.userId), { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.Entity.PatchMany)
  @Broadcast<Actions.Entity.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.Entity.PatchMany, @Context() ctx: Context.Action) {
    await this.service.patchManyForUser(
      Number(ctx.userId),
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.Entity.DeleteOne)
  @Broadcast<Actions.Entity.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.Entity.DeleteOne) {
    const result = await this.service.deleteManyAndSync([{ id, environmentID: context.environmentID }]);

    // overriding entities cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, entities: [] } });
  }

  @Action(Actions.Entity.DeleteMany)
  @Broadcast<Actions.Entity.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.Entity.DeleteMany) {
    const result = await this.service.deleteManyAndSync(ids.map((id) => ({ id, environmentID: context.environmentID })));

    // overriding entities cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, entities: [] } });
  }

  @Action(Actions.Entity.AddOne)
  @Broadcast<Actions.Entity.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.Entity.AddOne) {
    // for broadcast only
  }

  @Action(Actions.Entity.AddMany)
  @Broadcast<Actions.Entity.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.Entity.AddMany) {
    // for broadcast only
  }
}
