import type { MikroORM } from '@mikro-orm/core';
import { UseRequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, EntitySerializer } from '@/common';

import { EntityVariantService } from './entity-variant.service';

@Controller()
export class EntityVariantLoguxController {
  constructor(
    @Inject(getMikroORMToken(DatabaseTarget.POSTGRES))
    private readonly orm: MikroORM,
    @Inject(EntityVariantService)
    private readonly service: EntityVariantService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  @Action.Async(Actions.EntityVariant.CreateOne)
  @UseRequestContext()
  createOne(@Payload() { data, context }: Actions.EntityVariant.CreateOne.Request): Promise<Actions.EntityVariant.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast([{ ...data, assistantID: context.assistantID, environmentID: context.environmentID }])
      .then(([result]) => ({ data: this.entitySerializer.nullable(result), context }));
  }

  @Action.Async(Actions.EntityVariant.CreateMany)
  @UseRequestContext()
  createMany(@Payload() { data, context }: Actions.EntityVariant.CreateMany.Request): Promise<Actions.EntityVariant.CreateMany.Response> {
    return this.service
      .createManyAndBroadcast(data.map((item) => ({ ...item, assistantID: context.assistantID, environmentID: context.environmentID })))
      .then((result) => ({ data: this.entitySerializer.iterable(result), context }));
  }

  @Action(Actions.EntityVariant.PatchOne)
  @Broadcast<Actions.EntityVariant.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.EntityVariant.PatchOne) {
    await this.service.patchOne({ id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.EntityVariant.PatchMany)
  @Broadcast<Actions.EntityVariant.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.EntityVariant.PatchMany) {
    await this.service.patchMany(
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.EntityVariant.DeleteOne)
  @Broadcast<Actions.EntityVariant.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.EntityVariant.DeleteOne) {
    await this.service.deleteOne({ id, environmentID: context.environmentID });
  }

  @Action(Actions.EntityVariant.DeleteMany)
  @Broadcast<Actions.EntityVariant.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.EntityVariant.DeleteMany) {
    await this.service.deleteMany(ids.map((id) => ({ id, environmentID: context.environmentID })));
  }

  @Action(Actions.EntityVariant.AddOne)
  @Broadcast<Actions.EntityVariant.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.EntityVariant.AddOne) {
    // for broadcast only
  }

  @Action(Actions.EntityVariant.AddMany)
  @Broadcast<Actions.EntityVariant.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.EntityVariant.AddMany) {
    // for broadcast only
  }
}
