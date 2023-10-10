import type { MikroORM } from '@mikro-orm/core';
import { UseRequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import type { JSONResponseVariantEntity, PromptResponseVariantEntity, TextResponseVariantEntity } from '@voiceflow/orm-designer';
import { DatabaseTarget, ResponseVariantType } from '@voiceflow/orm-designer';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
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
  @Authorize.Permissions<Actions.ResponseVariant.CreateJSONOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createJSONOne(
    @Payload() { data, context }: Actions.ResponseVariant.CreateJSONOne.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.ResponseVariant.CreateJSONOne.Response> {
    return this.service
      .createManyAndBroadcast(authMeta, [
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
  @Authorize.Permissions<Actions.ResponseVariant.CreatePromptOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createPromptOne(
    @Payload() { data, context }: Actions.ResponseVariant.CreatePromptOne.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.ResponseVariant.CreatePromptOne.Response> {
    return this.service
      .createManyAndBroadcast(authMeta, [
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
  @Authorize.Permissions<Actions.ResponseVariant.CreatePromptMany.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createPromptMany(
    @Payload() { data, context }: Actions.ResponseVariant.CreatePromptMany.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.ResponseVariant.CreatePromptMany.Response> {
    return this.service
      .createManyAndBroadcast(
        authMeta,
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
  @Authorize.Permissions<Actions.ResponseVariant.CreateTextOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createTextOne(
    @Payload() { data, context }: Actions.ResponseVariant.CreateTextOne.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.ResponseVariant.CreateTextOne.Response> {
    return this.service
      .createManyAndBroadcast(authMeta, [
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
  @Authorize.Permissions<Actions.ResponseVariant.CreateTextMany.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createTextMany(
    @Payload() { data, context }: Actions.ResponseVariant.CreateTextMany.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.ResponseVariant.CreateTextMany.Response> {
    return this.service
      .createManyAndBroadcast(
        authMeta,
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
  @Authorize.Permissions<Actions.ResponseVariant.PatchOneJSON>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseVariant.PatchOneJSON>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOneJSON(@Payload() { id, patch, context }: Actions.ResponseVariant.PatchOneJSON) {
    await this.responseJSONVariant.patchOne({ id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.ResponseVariant.PatchOnePrompt)
  @Authorize.Permissions<Actions.ResponseVariant.PatchOnePrompt>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseVariant.PatchOnePrompt>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOnePrompt(@Payload() { id, patch, context }: Actions.ResponseVariant.PatchOnePrompt) {
    await this.responsePromptVariant.patchOne({ id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.ResponseVariant.PatchOneText)
  @Authorize.Permissions<Actions.ResponseVariant.PatchOneText>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseVariant.PatchOneText>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOneText(@Payload() { id, patch, context }: Actions.ResponseVariant.PatchOneText) {
    await this.responseTextVariant.patchOne({ id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.ResponseVariant.PatchManyJSON)
  @Authorize.Permissions<Actions.ResponseVariant.PatchManyJSON>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
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
  @Authorize.Permissions<Actions.ResponseVariant.PatchManyPrompt>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
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
  @Authorize.Permissions<Actions.ResponseVariant.PatchManyText>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
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
  @Authorize.Permissions<Actions.ResponseVariant.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseVariant.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.ResponseVariant.DeleteOne, @AuthMeta() authMeta: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([{ id, environmentID: context.environmentID }]);

    // overriding variants cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(authMeta, { ...result, delete: { ...result.delete, responseVariants: [] } });
  }

  @Action(Actions.ResponseVariant.DeleteMany)
  @Authorize.Permissions<Actions.ResponseVariant.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseVariant.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.ResponseVariant.DeleteMany, @AuthMeta() authMeta: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids.map((id) => ({ id, environmentID: context.environmentID })));

    // overriding variants cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(authMeta, { ...result, delete: { ...result.delete, responseVariants: [] } });
  }

  // no need to broadcast, cause it doesn't affect client state
  @Action(Actions.ResponseVariant.ReplaceWithType)
  @Authorize.Permissions<Actions.ResponseVariant.ReplaceWithType>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async replaceWithType(@Payload() { id, type, context }: Actions.ResponseVariant.ReplaceWithType, @AuthMeta() authMeta: AuthMetaPayload) {
    await this.service.replaceWithTypeAndBroadcast(authMeta, { id, environmentID: context.environmentID }, type);
  }

  @Action(Actions.ResponseVariant.PatchOne)
  @Authorize.Permissions<Actions.ResponseVariant.PatchOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseVariant.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() _: Actions.ResponseVariant.PatchOne) {
    // broadcast only
  }

  @Action(Actions.ResponseVariant.PatchMany)
  @Authorize.Permissions<Actions.ResponseVariant.PatchMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseVariant.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() _: Actions.ResponseVariant.PatchMany) {
    // broadcast only
  }

  @Action(Actions.ResponseVariant.AddOne)
  @Authorize.Permissions<Actions.ResponseVariant.AddOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseVariant.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.ResponseDiscriminator.AddOne) {
    // broadcast only
  }

  @Action(Actions.ResponseVariant.AddMany)
  @Authorize.Permissions<Actions.ResponseVariant.AddMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseVariant.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.ResponseVariant.AddMany) {
    // broadcast only
  }
}
