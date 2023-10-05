import type { MikroORM } from '@mikro-orm/core';
import { UseRequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, Broadcast, Context, Payload } from '@voiceflow/nestjs-logux';
import type { JSONResponseVariantEntity, PromptResponseVariantEntity, TextResponseVariantEntity } from '@voiceflow/orm-designer';
import { DatabaseTarget, ResponseVariantType } from '@voiceflow/orm-designer';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, EntitySerializer } from '@/common';

import { ResponseJSONVariantService } from './response-json-variant.service';
import { ResponsePromptVariantService } from './response-prompt-variant.service';
import { ResponseTextVariantService } from './response-text-variant.service';
import { ResponseVariantService } from './response-variant.service';

@Controller()
export class ResponseVariantLoguxController {
  // eslint-disable-next-line max-params
  constructor(
    @Inject(getMikroORMToken(DatabaseTarget.POSTGRES))
    private readonly orm: MikroORM,
    @Inject(ResponseVariantService)
    private readonly service: ResponseVariantService,
    @Inject(ResponseJSONVariantService)
    private readonly responseJSONVariant: ResponseJSONVariantService,
    @Inject(ResponseTextVariantService)
    private readonly responseTextVariant: ResponseTextVariantService,
    @Inject(ResponsePromptVariantService)
    private readonly responsePromptVariant: ResponsePromptVariantService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  @Action.Async(Actions.ResponseVariant.CreateJSONOne)
  @UseRequestContext()
  createJSONOne(
    @Payload() { data, context }: Actions.ResponseVariant.CreateJSONOne.Request,
    @Context() ctx: Context.Action
  ): Promise<Actions.ResponseVariant.CreateJSONOne.Response> {
    return this.service
      .createManyAndBroadcast(Number(ctx.userId), [
        {
          ...data,
          type: ResponseVariantType.JSON,
          assistantID: context.assistantID,
          environmentID: context.environmentID,
        },
      ])
      .then(([result]) => ({ data: this.entitySerializer.serialize(result as JSONResponseVariantEntity), context }));
  }

  @Action.Async(Actions.ResponseVariant.CreatePromptOne)
  @UseRequestContext()
  createPromptOne(
    @Payload() { data, context }: Actions.ResponseVariant.CreatePromptOne.Request,
    @Context() ctx: Context.Action
  ): Promise<Actions.ResponseVariant.CreatePromptOne.Response> {
    return this.service
      .createManyAndBroadcast(Number(ctx.userId), [
        {
          ...data,
          type: ResponseVariantType.PROMPT,
          assistantID: context.assistantID,
          environmentID: context.environmentID,
        },
      ])
      .then(([result]) => ({ data: this.entitySerializer.serialize(result as PromptResponseVariantEntity), context }));
  }

  @Action.Async(Actions.ResponseVariant.CreatePromptMany)
  @UseRequestContext()
  createPromptMany(
    @Payload() { data, context }: Actions.ResponseVariant.CreatePromptMany.Request,
    @Context() ctx: Context.Action
  ): Promise<Actions.ResponseVariant.CreatePromptMany.Response> {
    return this.service
      .createManyAndBroadcast(
        Number(ctx.userId),
        data.map((item) => ({
          ...item,
          type: ResponseVariantType.PROMPT,
          assistantID: context.assistantID,
          environmentID: context.environmentID,
        }))
      )
      .then((result) => ({ data: this.entitySerializer.iterable(result as PromptResponseVariantEntity[]), context }));
  }

  @Action.Async(Actions.ResponseVariant.CreateTextOne)
  @UseRequestContext()
  createTextOne(
    @Payload() { data, context }: Actions.ResponseVariant.CreateTextOne.Request,
    @Context() ctx: Context.Action
  ): Promise<Actions.ResponseVariant.CreateTextOne.Response> {
    return this.service
      .createManyAndBroadcast(Number(ctx.userId), [
        {
          ...data,
          type: ResponseVariantType.TEXT,
          assistantID: context.assistantID,
          environmentID: context.environmentID,
        },
      ])
      .then(([result]) => ({ data: this.entitySerializer.serialize(result as TextResponseVariantEntity), context }));
  }

  @Action.Async(Actions.ResponseVariant.CreateTextMany)
  @UseRequestContext()
  createTextMany(
    @Payload() { data, context }: Actions.ResponseVariant.CreateTextMany.Request,
    @Context() ctx: Context.Action
  ): Promise<Actions.ResponseVariant.CreateTextMany.Response> {
    return this.service
      .createManyAndBroadcast(
        Number(ctx.userId),
        data.map((item) => ({
          ...item,
          type: ResponseVariantType.TEXT,
          assistantID: context.assistantID,
          environmentID: context.environmentID,
        }))
      )
      .then((result) => ({ data: this.entitySerializer.iterable(result as TextResponseVariantEntity[]), context }));
  }

  @Action(Actions.ResponseVariant.PatchOneJSON)
  @Broadcast<Actions.ResponseVariant.PatchOneJSON>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOneJSON(@Payload() { id, patch, context }: Actions.ResponseVariant.PatchOneJSON) {
    await this.responseJSONVariant.patchOne({ id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.ResponseVariant.PatchOnePrompt)
  @Broadcast<Actions.ResponseVariant.PatchOnePrompt>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOnePrompt(@Payload() { id, patch, context }: Actions.ResponseVariant.PatchOnePrompt) {
    await this.responsePromptVariant.patchOne({ id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.ResponseVariant.PatchOneText)
  @Broadcast<Actions.ResponseVariant.PatchOneText>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOneText(@Payload() { id, patch, context }: Actions.ResponseVariant.PatchOneText) {
    await this.responseTextVariant.patchOne({ id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.ResponseVariant.PatchManyJSON)
  @Broadcast<Actions.ResponseVariant.PatchManyJSON>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchManyJSON(@Payload() { ids, patch, context }: Actions.ResponseVariant.PatchManyJSON) {
    await this.responseJSONVariant.patchMany(
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.ResponseVariant.PatchManyPrompt)
  @Broadcast<Actions.ResponseVariant.PatchManyPrompt>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchManyPrompt(@Payload() { ids, patch, context }: Actions.ResponseVariant.PatchManyPrompt) {
    await this.responsePromptVariant.patchMany(
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.ResponseVariant.PatchManyText)
  @Broadcast<Actions.ResponseVariant.PatchManyText>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchManyText(@Payload() { ids, patch, context }: Actions.ResponseVariant.PatchManyText) {
    await this.responseTextVariant.patchMany(
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.ResponseVariant.DeleteOne)
  @Broadcast<Actions.ResponseVariant.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.ResponseVariant.DeleteOne) {
    const result = await this.service.deleteManyAndSync([{ id, environmentID: context.environmentID }]);

    // overriding variants cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, responseVariants: [] } });
  }

  @Action(Actions.ResponseVariant.DeleteMany)
  @Broadcast<Actions.ResponseVariant.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.ResponseVariant.DeleteMany) {
    const result = await this.service.deleteManyAndSync(ids.map((id) => ({ id, environmentID: context.environmentID })));

    // overriding variants cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, responseVariants: [] } });
  }

  // no need to broadcast, cause it's doesn't affect client state
  @Action(Actions.ResponseVariant.ReplaceWithType)
  @UseRequestContext()
  async replaceWithType(@Payload() { id, type, context }: Actions.ResponseVariant.ReplaceWithType) {
    await this.service.replaceWithTypeAndBroadcast({ id, environmentID: context.environmentID }, type);
  }

  @Action(Actions.ResponseVariant.PatchOne)
  @Broadcast<Actions.ResponseVariant.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() _: Actions.ResponseVariant.PatchOne) {
    // broadcast only
  }

  @Action(Actions.ResponseVariant.PatchMany)
  @Broadcast<Actions.ResponseVariant.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() _: Actions.ResponseVariant.PatchMany) {
    // broadcast only
  }

  @Action(Actions.ResponseVariant.AddOne)
  @Broadcast<Actions.ResponseVariant.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.ResponseDiscriminator.AddOne) {
    // broadcast only
  }

  @Action(Actions.ResponseVariant.AddMany)
  @Broadcast<Actions.ResponseVariant.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.ResponseVariant.AddMany) {
    // broadcast only
  }
}
