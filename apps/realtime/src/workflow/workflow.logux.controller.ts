import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { WorkflowService } from './workflow.service';

@Controller()
@InjectRequestContext()
export class WorkflowLoguxController {
  constructor(
    @Inject(WorkflowService)
    private readonly service: WorkflowService
  ) {}

  @Action.Async(Actions.Workflow.CreateOne)
  @Authorize.Permissions<Actions.Workflow.CreateOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createOne(
    @Payload() { data, context }: Actions.Workflow.CreateOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Workflow.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast([{ ...data, isStart: false }], { auth, context })
      .then(([result]) => ({ data: this.service.toJSON(result), context }));
  }

  @Action.Async(Actions.Workflow.CreateMany)
  @Authorize.Permissions<Actions.Workflow.CreateMany.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async createMany(
    @Payload() { data, context }: Actions.Workflow.CreateMany.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Workflow.CreateMany.Response> {
    return this.service
      .createManyAndBroadcast(
        data.map((item) => ({ ...item, isStart: false })),
        { auth, context }
      )
      .then((results) => ({ data: this.service.mapToJSON(results), context }));
  }

  @Action.Async(Actions.Workflow.DuplicateOne)
  @Authorize.Permissions<Actions.Workflow.DuplicateOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async duplicateOne(
    @Payload() { data, context }: Actions.Workflow.DuplicateOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Workflow.DuplicateOne.Response> {
    return this.service.duplicateOneAndBroadcast(data, { auth, context }).then((result) => ({
      data: this.service.toJSON(result),
      context,
    }));
  }

  @Action.Async(Actions.Workflow.CopyPasteMany)
  @Authorize.Permissions<Actions.Workflow.CopyPasteMany.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async copyPasteMany(
    @Payload() { data, context }: Actions.Workflow.CopyPasteMany.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Workflow.CopyPasteMany.Response> {
    return this.service.copyPasteManyAndBroadcast(data, { auth, context }).then((result) => ({
      data: this.service.mapToJSON(result),
      context,
    }));
  }

  @Action(Actions.Workflow.PatchOne)
  @Authorize.Permissions<Actions.Workflow.PatchOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Workflow.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.Workflow.PatchOne, @AuthMeta() auth: AuthMetaPayload) {
    await this.service.patchOneForUserAndSendEmail(auth.userID, { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.Workflow.PatchMany)
  @Authorize.Permissions<Actions.Workflow.PatchMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Workflow.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.Workflow.PatchMany, @AuthMeta() auth: AuthMetaPayload) {
    await this.service.patchManyForUserAndSendEmail(
      auth.userID,
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.Workflow.DeleteOne)
  @Authorize.Permissions<Actions.Workflow.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Workflow.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.Workflow.DeleteOne, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([id], { context });

    // overriding entities cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, workflows: [] } }, { auth, context });
  }

  @Action(Actions.Workflow.DeleteMany)
  @Authorize.Permissions<Actions.Workflow.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Workflow.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.Workflow.DeleteMany, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids, { context });

    // overriding entities cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, workflows: [] } }, { auth, context });
  }

  @Action(Actions.Workflow.AddOne)
  @Authorize.Permissions<Actions.Workflow.AddOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Workflow.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.Workflow.AddOne) {
    // for broadcast only
  }

  @Action(Actions.Workflow.AddMany)
  @Authorize.Permissions<Actions.Workflow.AddMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Workflow.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.Workflow.AddMany) {
    // for broadcast only
  }
}
