import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, EntitySerializer, InjectRequestContext, UseRequestContext } from '@/common';

import { FunctionService } from './function.service';

@Controller()
@InjectRequestContext()
export class FunctionLoguxController {
  constructor(
    @Inject(FunctionService)
    private readonly service: FunctionService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  @Action.Async(Actions.Function.CreateOne)
  @Authorize.Permissions<Actions.Function.CreateOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async createOne(
    @Payload() { data, context }: Actions.Function.CreateOne.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.Function.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast(authMeta, [{ ...data, assistantID: context.assistantID, environmentID: context.environmentID }])
      .then(([result]) => ({ data: this.entitySerializer.nullable(result), context }));
  }

  @Action.Async(Actions.Function.DuplicateOne)
  @Authorize.Permissions<Actions.Function.DuplicateOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async duplicateOne(
    @Payload() { data, context }: Actions.Function.DuplicateOne.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.Function.DuplicateOne.Response> {
    return this.service
      .duplicateOneAndBroadcast(authMeta, {
        functionID: { id: data.functionID, environmentID: context.environmentID },
        assistantID: context.assistantID,
        userID: authMeta.userID,
      })
      .then((result) => ({
        data: {
          functionResource: this.entitySerializer.nullable(result.functionResource),
          functionPaths: this.entitySerializer.iterable(result.functionPaths),
          functionVariables: this.entitySerializer.iterable(result.functionVariables),
        },
        context,
      }));
  }

  @Action(Actions.Function.PatchOne)
  @Authorize.Permissions<Actions.Function.PatchOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Function.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.Function.PatchOne, @AuthMeta() authMeta: AuthMetaPayload) {
    await this.service.patchOneForUser(authMeta.userID, { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.Function.PatchMany)
  @Authorize.Permissions<Actions.Function.PatchMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Function.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.Function.PatchMany, @AuthMeta() authMeta: AuthMetaPayload) {
    await this.service.patchManyForUser(
      authMeta.userID,
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.Function.DeleteOne)
  @Authorize.Permissions<Actions.Function.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Function.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.Function.DeleteOne, @AuthMeta() authMeta: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([{ id, environmentID: context.environmentID }]);

    // overriding functions cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(authMeta, { ...result, delete: { ...result.delete, functions: [] } });
  }

  @Action(Actions.Function.DeleteMany)
  @Authorize.Permissions<Actions.Function.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Function.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.Function.DeleteMany, @AuthMeta() authMeta: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids.map((id) => ({ id, environmentID: context.environmentID })));

    // overriding functions cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(authMeta, { ...result, delete: { ...result.delete, functions: [] } });
  }

  @Action(Actions.Function.AddOne)
  @Broadcast<Actions.Function.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async addOne(@Payload() _: Actions.Function.AddOne) {
    // broadcast only
  }

  @Action(Actions.Function.AddMany)
  @Broadcast<Actions.Function.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async addMany(@Payload() _: Actions.Function.AddMany) {
    // broadcast only
  }

  @Action.Async(Actions.Function.CreateOneFromTemplate)
  @Authorize.Permissions<Actions.Function.CreateOneFromTemplate.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async createOneFromTemplate(
    @Payload() { data, context }: Actions.Function.CreateOneFromTemplate.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.Function.CreateOneFromTemplate.Response> {
    const createdFunction = await this.service.createOneFromTemplateAndBroadcast({
      data,
      userID: authMeta.userID,
      clientID: authMeta.clientID,
      environmentID: context.environmentID,
    });

    return {
      data: this.entitySerializer.nullable(createdFunction),
      context,
    };
  }
}
