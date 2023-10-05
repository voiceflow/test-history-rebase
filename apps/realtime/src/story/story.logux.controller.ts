import { type MikroORM, UseRequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, Broadcast, Context, Payload } from '@voiceflow/nestjs-logux';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, EntitySerializer } from '@/common';

import { StoryService } from './story.service';

@Controller()
export class StoryLoguxController {
  constructor(
    @Inject(getMikroORMToken(DatabaseTarget.POSTGRES))
    private readonly orm: MikroORM,
    @Inject(StoryService)
    private readonly service: StoryService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  @Action.Async(Actions.Story.CreateOne)
  @UseRequestContext()
  createOne(
    @Payload() { data, context }: Actions.Story.CreateOne.Request,
    @Context() ctx: Context.Action
  ): Promise<Actions.Story.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast(Number(ctx.userId), [
        {
          ...data,
          isStart: false,
          assigneeID: Number(ctx.userId),
          assistantID: context.assistantID,
          environmentID: context.environmentID,
          triggerOrder: [],
        },
      ])
      .then(([result]) => ({ data: this.entitySerializer.serialize(result), context }));
  }

  @Action(Actions.Story.PatchOne)
  @Broadcast<Actions.Story.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.Story.PatchOne, @Context() ctx: Context.Action) {
    await this.service.patchOneForUser(Number(ctx.userId), { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.Story.PatchMany)
  @Broadcast<Actions.Story.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.Story.PatchMany, @Context() ctx: Context.Action) {
    await this.service.patchManyForUser(
      Number(ctx.userId),
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.Story.DeleteOne)
  @Broadcast<Actions.Story.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.Story.DeleteOne) {
    const result = await this.service.deleteManyAndSync([{ id, environmentID: context.environmentID }]);

    // overriding stories cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, stories: [] } });
  }

  @Action(Actions.Story.DeleteMany)
  @Broadcast<Actions.Story.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.Story.DeleteMany) {
    const result = await this.service.deleteManyAndSync(ids.map((id) => ({ id, environmentID: context.environmentID })));

    // overriding stories cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, stories: [] } });
  }

  @Action(Actions.Story.AddOne)
  @Broadcast<Actions.Story.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.Story.AddOne) {
    // broadcast only
  }

  @Action(Actions.Story.AddMany)
  @Broadcast<Actions.Story.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.Story.AddMany) {
    // broadcast only
  }
}
