import type { MikroORM } from '@mikro-orm/core';
import { UseRequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, Broadcast, Channel, Context } from '@voiceflow/nestjs-logux';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { EntitySerializer } from '@/common';

import { AssistantSerializer } from './assistant.serializer';
import { AssistantService } from './assistant.service';

@Controller()
export class AssistantLoguxController {
  constructor(
    @Inject(getMikroORMToken(DatabaseTarget.POSTGRES))
    private readonly orm: MikroORM,
    @Inject(AssistantService)
    private readonly assistant: AssistantService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer,
    @Inject(AssistantSerializer)
    private readonly assistantSerializer: AssistantSerializer
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
      entityVariantReplaceMeta,
      entityReplaceMeta,

      // prompt
      promptReplaceMeta,

      // intent
      utteranceReplaceMeta,
      requiredEntityReplaceMeta,
      intentReplaceMeta,

      // response
      responseAttachmentReplaceMeta,
      responseVariantReplaceMeta,
      responseDiscriminatorReplaceMeta,
      responseReplaceMeta,

      // story
      triggerReplaceMeta,
      storyReplaceMeta,

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
    } = await this.assistant.getAllCMSData(assistantID, environmentID);

    const context = { assistantID, environmentID };

    const serializedAssistant = this.assistantSerializer.nullable(assistant);

    return [
      // attachments
      Actions.Attachment.Replace({ data: this.entitySerializer.iterable(attachments), context }, attachmentReplaceMeta),
      Actions.CardButton.Replace({ data: this.entitySerializer.iterable(cardButtons), context }, cardButtonReplaceMeta),

      // entity
      Actions.EntityVariant.Replace({ data: this.entitySerializer.iterable(entityVariants), context }, entityVariantReplaceMeta),
      Actions.Entity.Replace({ data: this.entitySerializer.iterable(entities), context }, entityReplaceMeta),

      // prompt
      Actions.Prompt.Replace({ data: this.entitySerializer.iterable(prompts), context }, promptReplaceMeta),

      // intent
      Actions.RequiredEntity.Replace({ data: this.entitySerializer.iterable(requiredEntities), context }, requiredEntityReplaceMeta),
      Actions.Utterance.Replace({ data: this.entitySerializer.iterable(utterances), context }, utteranceReplaceMeta),
      Actions.Intent.Replace({ data: this.entitySerializer.iterable(intents), context }, intentReplaceMeta),

      // response
      Actions.ResponseAttachment.Replace({ data: this.entitySerializer.iterable(responseAttachments), context }, responseAttachmentReplaceMeta),
      Actions.ResponseVariant.Replace({ data: this.entitySerializer.iterable(responseVariants), context }, responseVariantReplaceMeta),
      Actions.ResponseDiscriminator.Replace(
        { data: this.entitySerializer.iterable(responseDiscriminators), context },
        responseDiscriminatorReplaceMeta
      ),
      Actions.Response.Replace({ data: this.entitySerializer.iterable(responses), context }, responseReplaceMeta),

      // story
      Actions.Trigger.Replace({ data: this.entitySerializer.iterable(triggers), context }, triggerReplaceMeta),
      Actions.Story.Replace({ data: this.entitySerializer.iterable(stories), context }, storyReplaceMeta),

      // function
      Actions.Function.Replace({ data: this.entitySerializer.iterable(functions), context }, functionReplaceMeta),
      Actions.FunctionPath.Replace({ data: this.entitySerializer.iterable(functionPaths), context }, functionPathReplaceMeta),
      Actions.FunctionVariable.Replace({ data: this.entitySerializer.iterable(functionVariables), context }, functionVariableReplaceMeta),

      // assistant - should be last
      Actions.Assistant.Add({ data: serializedAssistant, context: { workspaceID: serializedAssistant.workspaceID } }, assistantAddMeta),
    ];
  }

  @Action(Actions.Assistant.Add)
  @Authorize.Permissions<Actions.Assistant.Add>([Permission.WORKSPACE_PROJECT_CREATE], ({ data }) => ({
    id: data.workspaceID,
    kind: 'workspace',
  }))
  @Broadcast<Actions.Assistant.Add>(({ context }) => ({ channel: Channels.workspace.build(context) }))
  addOne() {
    // broadcast only
  }
}
