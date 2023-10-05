import type { MikroORM } from '@mikro-orm/core';
import { UseRequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, EntitySerializer } from '@/common';

import { RequiredEntityService } from './required-entity.service';

@Controller()
export class RequiredEntityLoguxController {
  constructor(
    @Inject(getMikroORMToken(DatabaseTarget.POSTGRES))
    private readonly orm: MikroORM,
    @Inject(RequiredEntityService)
    private readonly service: RequiredEntityService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  @Action.Async(Actions.RequiredEntity.CreateOne)
  @UseRequestContext()
  create(@Payload() { data, context }: Actions.RequiredEntity.CreateOne.Request): Promise<Actions.RequiredEntity.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast([{ ...data, assistantID: context.assistantID, environmentID: context.environmentID }])
      .then(([requiredEntity]) => ({ data: this.entitySerializer.nullable(requiredEntity), context }));
  }

  @Action.Async(Actions.RequiredEntity.CreateMany)
  @UseRequestContext()
  async createMany(@Payload() { data, context }: Actions.RequiredEntity.CreateMany.Request): Promise<Actions.RequiredEntity.CreateMany.Response> {
    return this.service
      .createManyAndBroadcast(data.map((item) => ({ ...item, assistantID: context.assistantID, environmentID: context.environmentID })))
      .then((requiredEntities) => ({ data: this.entitySerializer.iterable(requiredEntities), context }));
  }

  @Action(Actions.RequiredEntity.PatchOne)
  @Broadcast<Actions.RequiredEntity.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.RequiredEntity.PatchOne) {
    await this.service.patchOne({ id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.RequiredEntity.PatchMany)
  @Broadcast<Actions.RequiredEntity.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.RequiredEntity.PatchMany) {
    await this.service.patchMany(
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.RequiredEntity.DeleteOne)
  @Broadcast<Actions.RequiredEntity.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.RequiredEntity.DeleteOne) {
    const result = await this.service.deleteManyAndSync([{ id, environmentID: context.environmentID }]);

    // overriding requiredEntities cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, requiredEntities: [] } });
  }

  @Action(Actions.RequiredEntity.DeleteMany)
  @Broadcast<Actions.RequiredEntity.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.RequiredEntity.DeleteMany) {
    const result = await this.service.deleteManyAndSync(ids.map((id) => ({ id, environmentID: context.environmentID })));

    // overriding requiredEntities cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, requiredEntities: [] } });
  }

  @Action(Actions.RequiredEntity.AddOne)
  @Broadcast<Actions.RequiredEntity.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.RequiredEntity.AddOne) {
    // broadcast only
  }

  @Action(Actions.RequiredEntity.AddMany)
  @Broadcast<Actions.RequiredEntity.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.RequiredEntity.AddMany) {
    // broadcast only
  }
}
