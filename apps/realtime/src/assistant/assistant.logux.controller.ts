/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Channel, Context, LoguxService, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, EntitySerializer, InjectRequestContext, UseRequestContext } from '@/common';
import { ProjectSerializer } from '@/project/project.serializer';

import { AssistantSerializer } from './assistant.serializer';
import { AssistantService } from './assistant.service';
import { AssistantViewerService } from './assistant-viewer.service';

@Controller()
@InjectRequestContext()
export class AssistantLoguxController {
  // eslint-disable-next-line max-params
  constructor(
    @Inject(AssistantService)
    private readonly service: AssistantService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer,
    @Inject(ProjectSerializer)
    private readonly projectSerializer: ProjectSerializer,
    @Inject(AssistantSerializer)
    private readonly assistantSerializer: AssistantSerializer,
    @Inject(AssistantViewerService)
    private readonly viewerService: AssistantViewerService,
    @Inject(LoguxService)
    private readonly logux: LoguxService
  ) {}

  @Channel(Channels.assistant)
  @Authorize.Permissions<Channels.AssistantParams>([Permission.PROJECT_READ], ({ assistantID }) => ({
    id: assistantID,
    kind: 'project',
  }))
  @UseRequestContext()
  async subscribe(@Context() ctx: Context.Channel<Channels.AssistantParams>) {
    const { assistantID, environmentID } = ctx.params;

    // The creation order must be the same as the order of the returned actions
    const [
      // attachment
      attachmentReplaceMeta,
      cardButtonReplaceMeta,

      // entity
      entityReplaceMeta,
      entityVariantReplaceMeta,

      // prompt
      promptReplaceMeta,

      // intent
      intentReplaceMeta,
      utteranceReplaceMeta,
      requiredEntityReplaceMeta,

      // response
      responseReplaceMeta,
      responseDiscriminatorReplaceMeta,
      responseVariantReplaceMeta,
      responseAttachmentReplaceMeta,

      // story
      storyReplaceMeta,
      triggerReplaceMeta,

      // function
      functionReplaceMeta,
      functionPathReplaceMeta,
      functionVariableReplaceMeta,

      // assistant
      assistantAddMeta,
    ] = [
      { id: ctx.server.log.generateId() },
      { id: ctx.server.log.generateId() },
      { id: ctx.server.log.generateId() },
      { id: ctx.server.log.generateId() },
      { id: ctx.server.log.generateId() },
      { id: ctx.server.log.generateId() },
      { id: ctx.server.log.generateId() },
      { id: ctx.server.log.generateId() },
      { id: ctx.server.log.generateId() },
      { id: ctx.server.log.generateId() },
      { id: ctx.server.log.generateId() },
      { id: ctx.server.log.generateId() },
      { id: ctx.server.log.generateId() },
      { id: ctx.server.log.generateId() },
      { id: ctx.server.log.generateId() },
      { id: ctx.server.log.generateId() },
      { id: ctx.server.log.generateId() },
      { id: ctx.server.log.generateId() },
      { id: ctx.server.log.generateId() },
    ] as const;

    const {
      stories,
      intents,
      prompts,
      entities,
      triggers,
      responses,
      assistant,
      functions,
      utterances,
      attachments,
      cardButtons,
      functionPaths,
      entityVariants,
      requiredEntities,
      responseVariants,
      functionVariables,
      responseAttachments,
      responseDiscriminators,
    } = await this.service.findOneCMSData(assistantID, environmentID);

    const context = { assistantID, environmentID };

    const serializedAssistant = this.assistantSerializer.nullable(assistant);

    Object.assign(ctx.data, { subscribed: true });

    return [
      // attachments
      Actions.Attachment.Replace({ data: this.entitySerializer.iterable(attachments), context }, attachmentReplaceMeta),
      Actions.CardButton.Replace({ data: this.entitySerializer.iterable(cardButtons), context }, cardButtonReplaceMeta),

      // entity
      Actions.Entity.Replace({ data: this.entitySerializer.iterable(entities), context }, entityReplaceMeta),
      Actions.EntityVariant.Replace({ data: this.entitySerializer.iterable(entityVariants), context }, entityVariantReplaceMeta),

      // prompt
      Actions.Prompt.Replace({ data: this.entitySerializer.iterable(prompts), context }, promptReplaceMeta),

      // intent
      Actions.Intent.Replace({ data: this.entitySerializer.iterable(intents), context }, intentReplaceMeta),
      Actions.Utterance.Replace({ data: this.entitySerializer.iterable(utterances), context }, utteranceReplaceMeta),
      Actions.RequiredEntity.Replace({ data: this.entitySerializer.iterable(requiredEntities), context }, requiredEntityReplaceMeta),

      // response
      Actions.Response.Replace({ data: this.entitySerializer.iterable(responses), context }, responseReplaceMeta),
      Actions.ResponseDiscriminator.Replace(
        { data: this.entitySerializer.iterable(responseDiscriminators), context },
        responseDiscriminatorReplaceMeta
      ),
      Actions.ResponseVariant.Replace({ data: this.entitySerializer.iterable(responseVariants), context }, responseVariantReplaceMeta),
      Actions.ResponseAttachment.Replace({ data: this.entitySerializer.iterable(responseAttachments), context }, responseAttachmentReplaceMeta),

      // story
      Actions.Story.Replace({ data: this.entitySerializer.iterable(stories), context }, storyReplaceMeta),
      Actions.Trigger.Replace({ data: this.entitySerializer.iterable(triggers), context }, triggerReplaceMeta),

      // function
      Actions.Function.Replace({ data: this.entitySerializer.iterable(functions), context }, functionReplaceMeta),
      Actions.FunctionPath.Replace({ data: this.entitySerializer.iterable(functionPaths), context }, functionPathReplaceMeta),
      Actions.FunctionVariable.Replace({ data: this.entitySerializer.iterable(functionVariables), context }, functionVariableReplaceMeta),

      // assistant - should be last
      Actions.Assistant.AddOne({ data: serializedAssistant, context: { workspaceID: serializedAssistant.workspaceID } }, assistantAddMeta),
    ];
  }

  @Channel.Finally(Channels.assistant)
  async finally(@Context() ctx: Context.Channel<Channels.AssistantParams>, @AuthMeta() authMeta: AuthMetaPayload) {
    if (!('subscribed' in ctx.data)) return;

    const { assistantID, environmentID } = ctx.params;

    await this.viewerService.addViewer({ viewerID: ctx.userId, assistantID, environmentID });

    const viewers = await this.viewerService.getAllViewers({ assistantID, environmentID });

    await this.logux.processAs(
      Actions.AssistantAwareness.ReplaceViewers({ viewers, context: { assistantID, environmentID, broadcastOnly: true } }),
      authMeta
    );
  }

  @Channel.Unsubscribe(Channels.assistant)
  async unsubscribe(@Context() ctx: Context.Channel<Channels.AssistantParams>, @AuthMeta() authMeta: AuthMetaPayload) {
    const { userId } = ctx;
    const { assistantID, environmentID } = ctx.params;

    await this.viewerService.removeViewer({ viewerID: userId, assistantID, environmentID });

    const viewers = await this.viewerService.getAllViewers({ assistantID, environmentID });

    await this.logux.processAs(
      Actions.AssistantAwareness.ReplaceViewers({ viewers, context: { assistantID, environmentID, broadcastOnly: true } }),
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
      .createOneFromTemplateAndBroadcast(authMeta, { ...data, workspaceID: this.assistantSerializer.decodeWorkspaceID(context.workspaceID) })
      .then(({ project, assistant }) => ({
        data: { project: this.projectSerializer.nullable(project), assistant: this.assistantSerializer.nullable(assistant) },
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
        data: { project: this.projectSerializer.nullable(project), assistant: this.assistantSerializer.nullable(assistant) },
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
  @Authorize.Permissions<Actions.Entity.CreateOne.Request>([Permission.PROJECT_READ], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.AssistantAwareness.ReplaceViewers>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async replaceAssistantViewers(@Payload() _: Actions.AssistantAwareness.ReplaceViewers) {
    // for broadcast only
  }
}
