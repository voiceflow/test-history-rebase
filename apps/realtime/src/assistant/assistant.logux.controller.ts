import { Controller, Inject } from '@nestjs/common';
import {
  Action,
  AuthMeta,
  AuthMetaPayload,
  Broadcast,
  Channel,
  Context,
  LoguxService,
  Payload,
} from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';
import { ProjectSerializer } from '@/project/project.serializer';

import { AssistantSerializer } from './assistant.serializer';
import { AssistantService } from './assistant.service';
import { AssistantViewerService } from './assistant-viewer.service';

@Controller()
@InjectRequestContext()
export class AssistantLoguxController {
  constructor(
    @Inject(AssistantService)
    private readonly service: AssistantService,
    @Inject(ProjectSerializer)
    private readonly projectSerializer: ProjectSerializer,
    @Inject(AssistantSerializer)
    private readonly assistantSerializer: AssistantSerializer,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(AssistantViewerService)
    private readonly viewer: AssistantViewerService
  ) {}

  @Channel(Channels.assistant)
  @Authorize.Permissions<Channels.AssistantParams>([Permission.PROJECT_READ], ({ assistantID }) => ({
    id: assistantID,
    kind: 'project',
  }))
  @UseRequestContext()
  async subscribe(@Context() ctx: Context.Channel<Channels.AssistantParams>) {
    Object.assign(ctx.data, { subscribed: true });

    return [];
  }

  @Channel.Finally(Channels.assistant)
  async finally(@Context() ctx: Context.Channel<Channels.AssistantParams>, @AuthMeta() authMeta: AuthMetaPayload) {
    if (!('subscribed' in ctx.data)) return;

    const { assistantID, environmentID } = ctx.params;

    await this.viewer.addViewer({ viewerID: authMeta.userID, assistantID, environmentID });

    const viewers = await this.viewer.getAllViewers({ assistantID, environmentID });

    await this.logux.processAs(
      Actions.AssistantAwareness.ReplaceViewers({
        viewers,
        context: { assistantID, environmentID, broadcastOnly: true },
      }),
      authMeta
    );
  }

  @Channel.Unsubscribe(Channels.assistant)
  async unsubscribe(@Context() ctx: Context.Channel<Channels.AssistantParams>, @AuthMeta() authMeta: AuthMetaPayload) {
    const { assistantID, environmentID } = ctx.params;

    await this.viewer.removeViewer({ viewerID: authMeta.userID, assistantID, environmentID });

    const viewers = await this.viewer.getAllViewers({ assistantID, environmentID });

    await this.logux.processAs(
      Actions.AssistantAwareness.ReplaceViewers({
        viewers,
        context: { assistantID, environmentID, broadcastOnly: true },
      }),
      authMeta
    );
  }

  @Action.Async(Actions.Assistant.CreateOne)
  @Authorize.Permissions<Actions.Assistant.CreateOne.Request>([Permission.WORKSPACE_PROJECT_CREATE], ({ context }) => ({
    id: context.workspaceID,
    kind: 'workspace',
  }))
  @UseRequestContext()
  createOne(
    @Payload() { data, context }: Actions.Assistant.CreateOne.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.Assistant.CreateOne.Response> {
    return this.service
      .createOneFromTemplateAndBroadcast(authMeta, {
        ...data,
        workspaceID: this.assistantSerializer.decodeWorkspaceID(context.workspaceID),
      })
      .then(({ project, assistant }) => ({
        data: {
          project: this.projectSerializer.nullable(project),
          assistant: this.assistantSerializer.nullable(assistant),
        },
        context: { workspaceID: context.workspaceID },
      }));
  }

  @Action.Async(Actions.Assistant.DuplicateOne)
  @Authorize.Permissions<Actions.Assistant.DuplicateOne.Request>([Permission.WORKSPACE_PROJECT_CREATE], ({ data }) => ({
    id: data.targetWorkspaceID,
    kind: 'workspace',
  }))
  @UseRequestContext()
  duplicateOne(
    @Payload() { data }: Actions.Assistant.DuplicateOne.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.Assistant.DuplicateOne.Response> {
    return this.service
      .cloneOneAndBroadcast({
        ...authMeta,
        targetWorkspaceID: this.assistantSerializer.decodeWorkspaceID(data.targetWorkspaceID),
        sourceAssistantID: data.sourceAssistantID,
        targetProjectOverride: data.targetAssistantOverride,
      })
      .then(({ project, assistant }) => ({
        data: {
          project: this.projectSerializer.nullable(project),
          assistant: this.assistantSerializer.nullable(assistant),
        },
        context: { workspaceID: data.targetWorkspaceID },
      }));
  }

  @Action(Actions.Assistant.AddOne)
  @Authorize.Permissions<Actions.Assistant.AddOne>([Permission.WORKSPACE_PROJECT_CREATE], ({ data }) => ({
    id: data.workspaceID,
    kind: 'workspace',
  }))
  @Broadcast<Actions.Assistant.AddOne>(({ context }) => ({ channel: Channels.workspace.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.Assistant.AddOne) {
    // for broadcast only
  }

  @Action(Actions.AssistantAwareness.ReplaceViewers)
  @Authorize.Permissions<Actions.AssistantAwareness.ReplaceViewers>([Permission.PROJECT_READ], ({ context }) => ({
    id: context.assistantID,
    kind: 'project',
  }))
  @Broadcast<Actions.AssistantAwareness.ReplaceViewers>(({ context }) => ({
    channel: Channels.assistant.build(context),
  }))
  @BroadcastOnly()
  async replaceAssistantViewers(@Payload() _: Actions.AssistantAwareness.ReplaceViewers) {
    // for broadcast only
  }
}
