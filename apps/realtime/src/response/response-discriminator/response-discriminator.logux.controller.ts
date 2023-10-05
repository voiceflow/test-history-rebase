import type { MikroORM } from '@mikro-orm/core';
import { UseRequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, EntitySerializer } from '@/common';

import { ResponseDiscriminatorService } from './response-discriminator.service';

@Controller()
export class ResponseDiscriminatorLoguxController {
  constructor(
    @Inject(getMikroORMToken(DatabaseTarget.POSTGRES))
    private readonly orm: MikroORM,
    @Inject(ResponseDiscriminatorService)
    private readonly service: ResponseDiscriminatorService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  @Action.Async(Actions.ResponseDiscriminator.CreateOne)
  @UseRequestContext()
  async createOne(
    @Payload() { data, context }: Actions.ResponseDiscriminator.CreateOne.Request
  ): Promise<Actions.ResponseDiscriminator.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast([{ ...data, assistantID: context.assistantID, environmentID: context.environmentID }])
      .then(([result]) => ({ data: this.entitySerializer.nullable(result), context }));
  }

  @Action(Actions.ResponseDiscriminator.PatchOne)
  @Broadcast<Actions.ResponseDiscriminator.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.ResponseDiscriminator.PatchOne) {
    await this.service.patchOne({ id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.ResponseDiscriminator.PatchMany)
  @Broadcast<Actions.ResponseDiscriminator.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.ResponseDiscriminator.PatchMany) {
    await this.service.patchMany(
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.ResponseDiscriminator.DeleteOne)
  @Broadcast<Actions.ResponseDiscriminator.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.ResponseDiscriminator.DeleteOne) {
    const result = await this.service.deleteManyAndSync([{ id, environmentID: context.environmentID }]);

    // overriding discriminators cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, responseDiscriminators: [] } });
  }

  @Action(Actions.ResponseDiscriminator.DeleteMany)
  @Broadcast<Actions.ResponseDiscriminator.DeleteMany>(({ context }) => ({
    channel: Channels.assistant.build(context),
  }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.ResponseDiscriminator.DeleteMany) {
    const result = await this.service.deleteManyAndSync(ids.map((id) => ({ id, environmentID: context.environmentID })));

    // overriding discriminators cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, responseDiscriminators: [] } });
  }

  @Action(Actions.ResponseDiscriminator.AddOne)
  @Broadcast<Actions.ResponseDiscriminator.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.ResponseDiscriminator.AddOne) {
    // broadcast only
  }

  @Action(Actions.ResponseDiscriminator.AddMany)
  @Broadcast<Actions.ResponseDiscriminator.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.ResponseDiscriminator.AddMany) {
    // broadcast only
  }
}
