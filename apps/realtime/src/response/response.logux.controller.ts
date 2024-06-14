import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { ResponseLoguxService } from './response.logux.service';
import { ResponseRepository } from './response.repository';
import { ResponseService } from './response.service';
import { ResponseDuplicateService } from './response-duplicate.service';

@Controller()
@InjectRequestContext()
export class ResponseLoguxController {
  constructor(
    @Inject(ResponseService)
    private readonly service: ResponseService,
    @Inject(ResponseLoguxService)
    private readonly logux: ResponseLoguxService,
    @Inject(ResponseRepository)
    private readonly repository: ResponseRepository,
    @Inject(ResponseDuplicateService)
    private readonly duplicateService: ResponseDuplicateService
  ) {}

  @Action.Async(Actions.Response.CreateOne)
  @Authorize.Permissions<Actions.Response.CreateOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async createOne(
    @Payload() { data, context }: Actions.Response.CreateOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Response.CreateOne.Response> {
    const result = await this.repository.createManyResponses([data], { userID: auth.userID, context });

    this.logux.broadcastAddMany({ add: result }, { auth, context });

    return { data: this.repository.toJSON(result.responses[0]), context };
  }

  @Action.Async(Actions.Response.CreateMany)
  @Authorize.Permissions<Actions.Response.CreateMany.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async createMany(
    @Payload() { data, context }: Actions.Response.CreateMany.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Response.CreateMany.Response> {
    const result = await this.repository.createManyResponses(data, { userID: auth.userID, context });

    this.logux.broadcastAddMany({ add: result }, { auth, context });

    return { data: this.repository.mapToJSON(result.responses), context };
  }

  @Action.Async(Actions.Response.DuplicateOne)
  @Authorize.Permissions<Actions.Response.DuplicateOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async duplicateOne(
    @Payload() { data, context }: Actions.Response.DuplicateOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Response.DuplicateOne.Response> {
    const result = await this.duplicateService.duplicate([data.responseID], { userID: auth.userID, context });
    return { data: { responseResource: this.repository.toJSON(result.responses[0]) }, context };
  }

  @Action(Actions.Response.PatchOne)
  @Authorize.Permissions<Actions.Response.PatchOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Response.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.Response.PatchOne, @AuthMeta() auth: AuthMetaPayload) {
    await this.repository.patchOneForUser(auth.userID, { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.Response.PatchMany)
  @Authorize.Permissions<Actions.Response.PatchMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Response.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.Response.PatchMany, @AuthMeta() auth: AuthMetaPayload) {
    await this.repository.patchManyForUser(
      auth.userID,
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.Response.DeleteOne)
  @Authorize.Permissions<Actions.Response.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Response.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.Response.DeleteOne, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.repository.deleteManyResponsesAndRelations([id], { userID: auth.userID, context });

    const broadcastResult = {
      sync: { requiredEntities: result.requiredEntities },
      delete: {
        responseAttachments: result.responseAttachments,
        responseDiscriminators: result.responseDiscriminators,
        responseVariants: result.responseVariants,
        responses: [],
      },
    };

    // overriding responses cause it's broadcasted by decorator
    await this.logux.broadcastDeleteMany(broadcastResult, { auth, context });
  }

  @Action(Actions.Response.DeleteMany)
  @Authorize.Permissions<Actions.Response.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Response.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.Response.DeleteMany, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.repository.deleteManyResponsesAndRelations(ids, { userID: auth.userID, context });

    const broadcastResult = {
      sync: { requiredEntities: result.requiredEntities },
      delete: {
        responseAttachments: result.responseAttachments,
        responseDiscriminators: result.responseDiscriminators,
        responseVariants: result.responseVariants,
        responses: [],
      },
    };

    // overriding responses cause it's broadcasted by decorator
    await this.logux.broadcastDeleteMany(broadcastResult, { auth, context });
  }

  @Action(Actions.Response.AddOne)
  @Authorize.Permissions<Actions.Response.AddOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Response.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.Response.AddOne) {
    // broadcast only
  }

  @Action(Actions.Response.AddMany)
  @Authorize.Permissions<Actions.Response.AddMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Response.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.Response.AddMany) {
    // broadcast only
  }
}
