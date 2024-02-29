import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, EntitySerializer, InjectRequestContext, UseRequestContext } from '@/common';

import { FlowService } from './flow.service';

@Controller()
@InjectRequestContext()
export class FlowLoguxController {
  constructor(
    @Inject(FlowService)
    private readonly service: FlowService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  @Action.Async(Actions.Flow.CreateOne)
  @Authorize.Permissions<Actions.Flow.CreateOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createOne(
    @Payload() { data: { diagram, ...flow }, context }: Actions.Flow.CreateOne.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.Flow.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast(
        authMeta,
        [
          {
            flow: { ...flow, assistantID: context.assistantID, environmentID: context.environmentID },
            diagram,
          },
        ],
        {
          assistantID: context.assistantID,
          environmentID: context.environmentID,
        }
      )
      .then(([result]) => ({ data: this.entitySerializer.nullable(result), context }));
  }

  @Action.Async(Actions.Flow.CreateMany)
  @Authorize.Permissions<Actions.Flow.CreateMany.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async createMany(
    @Payload() { data, context }: Actions.Flow.CreateMany.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.Flow.CreateMany.Response> {
    return this.service
      .createManyAndBroadcast(
        authMeta,
        data.map(({ diagram, ...flow }) => ({
          flow: { ...flow, assistantID: context.assistantID, environmentID: context.environmentID },
          diagram,
        })),
        {
          assistantID: context.assistantID,
          environmentID: context.environmentID,
        }
      )
      .then((results) => ({ data: this.entitySerializer.iterable(results), context }));
  }

  @Action.Async(Actions.Flow.DuplicateOne)
  @Authorize.Permissions<Actions.Flow.DuplicateOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async duplicateOne(
    @Payload() { data, context }: Actions.Flow.DuplicateOne.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.Flow.DuplicateOne.Response> {
    return this.service
      .duplicateOneAndBroadcast(authMeta, data, {
        assistantID: context.assistantID,
        environmentID: context.environmentID,
      })
      .then((result) => ({
        data: this.entitySerializer.nullable(result),
        context,
      }));
  }

  @Action.Async(Actions.Flow.CopyPasteMany)
  @Authorize.Permissions<Actions.Flow.CopyPasteMany.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async copyPasteMany(
    @Payload() { data, context }: Actions.Flow.CopyPasteMany.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.Flow.CopyPasteMany.Response> {
    return this.service
      .copyPasteManyAndBroadcast(authMeta, data, {
        assistantID: context.assistantID,
        environmentID: context.environmentID,
      })
      .then((result) => ({
        data: this.entitySerializer.iterable(result),
        context,
      }));
  }

  @Action(Actions.Flow.PatchOneUpadtedBy)
  @Authorize.Permissions<Actions.Flow.PatchOneUpadtedBy>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Flow.PatchOneUpadtedBy>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async PatchOneUpadtedBy(@Payload() { diagramID, context }: Actions.Flow.PatchOneUpadtedBy, @AuthMeta() authMeta: AuthMetaPayload) {
    await this.service.patchOneUpdatedBy(authMeta.userID, { diagramID, environmentID: context.environmentID });
  }

  @Action(Actions.Flow.PatchOne)
  @Authorize.Permissions<Actions.Flow.PatchOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Flow.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.Flow.PatchOne, @AuthMeta() authMeta: AuthMetaPayload) {
    await this.service.patchOneForUser(authMeta.userID, { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.Flow.PatchMany)
  @Authorize.Permissions<Actions.Flow.PatchMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Flow.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.Flow.PatchMany, @AuthMeta() authMeta: AuthMetaPayload) {
    await this.service.patchManyForUser(
      authMeta.userID,
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.Flow.DeleteOne)
  @Authorize.Permissions<Actions.Flow.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Flow.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, keepDiagram, context }: Actions.Flow.DeleteOne, @AuthMeta() authMeta: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([{ id, environmentID: context.environmentID }], { keepDiagram });

    // overriding entities cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(authMeta, { ...result, delete: { ...result.delete, flows: [] } }, context);
  }

  @Action(Actions.Flow.DeleteMany)
  @Authorize.Permissions<Actions.Flow.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Flow.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, keepDiagram, context }: Actions.Flow.DeleteMany, @AuthMeta() authMeta: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      { keepDiagram }
    );

    // overriding entities cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(authMeta, { ...result, delete: { ...result.delete, flows: [] } }, context);
  }

  @Action(Actions.Flow.AddOne)
  @Authorize.Permissions<Actions.Flow.AddOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Flow.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.Flow.AddOne) {
    // for broadcast only
  }

  @Action(Actions.Flow.AddMany)
  @Authorize.Permissions<Actions.Flow.AddMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Flow.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.Flow.AddMany) {
    // for broadcast only
  }
}
