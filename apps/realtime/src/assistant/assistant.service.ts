/* eslint-disable max-params */
import { RequestContext } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { HashedIDService } from '@voiceflow/nestjs-common';
import type { PKOrEntity, WorkspaceStubEntity } from '@voiceflow/orm-designer';
import { AssistantORM } from '@voiceflow/orm-designer';

import { AttachmentService } from '@/attachment/attachment.service';
import { CardButtonService } from '@/attachment/card-button/card-button.service';
import { MutableService } from '@/common';
import { CreateOneData } from '@/common/types';
import { EntityService } from '@/entity/entity.service';
import { EntityVariantService } from '@/entity/entity-variant/entity-variant.service';
import { FunctionService } from '@/function/function.service';
import { FunctionPathService } from '@/function/function-path/function-path.service';
import { FunctionVariableService } from '@/function/function-variable/function-variable.service';
import { IntentService } from '@/intent/intent.service';
import { RequiredEntityService } from '@/intent/required-entity/required-entity.service';
import { UtteranceService } from '@/intent/utterance/utterance.service';
import { PromptService } from '@/prompt/prompt.service';
import { ResponseService } from '@/response/response.service';
import { ResponseAttachmentService } from '@/response/response-attachment/response-attachment.service';
import { ResponseDiscriminatorService } from '@/response/response-discriminator/response-discriminator.service';
import { ResponseVariantService } from '@/response/response-variant/response-variant.service';
import { StoryService } from '@/story/story.service';
import { TriggerService } from '@/story/trigger/trigger.service';

import { AssistantSerializer } from './assistant.serializer';

@Injectable()
export class AssistantService extends MutableService<AssistantORM> {
  constructor(
    @Inject(AssistantORM)
    protected readonly orm: AssistantORM,
    @Inject(StoryService)
    private readonly story: StoryService,
    @Inject(IntentService)
    private readonly intent: IntentService,
    @Inject(EntityService)
    private readonly entity: EntityService,
    @Inject(TriggerService)
    private readonly trigger: TriggerService,
    @Inject(PromptService)
    private readonly prompt: PromptService,
    @Inject(ResponseService)
    private readonly response: ResponseService,
    @Inject(UtteranceService)
    private readonly utterance: UtteranceService,
    @Inject(HashedIDService)
    private readonly hashedID: HashedIDService,
    @Inject(AttachmentService)
    private readonly attachment: AttachmentService,
    @Inject(CardButtonService)
    private readonly cardButton: CardButtonService,
    @Inject(EntityVariantService)
    private readonly entityVariant: EntityVariantService,
    @Inject(RequiredEntityService)
    private readonly requiredEntity: RequiredEntityService,
    @Inject(ResponseVariantService)
    private readonly responseVariant: ResponseVariantService,
    @Inject(ResponseAttachmentService)
    private readonly responseAttachment: ResponseAttachmentService,
    @Inject(ResponseDiscriminatorService)
    private readonly responseDiscriminator: ResponseDiscriminatorService,
    @Inject(FunctionService)
    private readonly functionService: FunctionService,
    @Inject(FunctionService)
    private readonly functionPathService: FunctionPathService,
    @Inject(FunctionService)
    private readonly functionVariableService: FunctionVariableService,
    @Inject(AssistantSerializer)
    private readonly assistantSerializer: AssistantSerializer
  ) {
    super();
  }

  public async createOneForLegacyProject(workspaceID: string, projectID: string, data: Omit<CreateOneData<AssistantORM>, 'workspaceID'>) {
    return RequestContext.createAsync(this.orm.em, async () => {
      const assistant = await this.orm.createOne({ ...data, workspaceID: this.hashedID.decodeWorkspaceID(workspaceID) }, { flush: false });

      assistant.id = projectID;

      await this.orm.em.flush();

      return this.assistantSerializer.nullable(assistant);
    });
  }

  public async findManyByWorkspace(workspace: PKOrEntity<WorkspaceStubEntity>) {
    return this.orm.findManyByWorkspace(workspace);
  }

  public async getAllCMSData(assistantID: string, environmentID: string) {
    const [
      stories,
      intents,
      entities,
      triggers,
      prompts,
      responses,
      assistant,
      utterances,
      attachments,
      cardButtons,
      entityVariants,
      requiredEntities,
      responseVariants,
      responseAttachments,
      responseDiscriminators,
      functions,
      functionPaths,
      functionVariables,
    ] = await Promise.all([
      this.story.findManyByAssistant(assistantID, environmentID),
      this.intent.findManyByAssistant(assistantID, environmentID),
      this.entity.findManyByAssistant(assistantID, environmentID),
      this.trigger.findManyByAssistant(assistantID, environmentID),
      this.prompt.findManyByAssistant(assistantID, environmentID),
      this.response.findManyByAssistant(assistantID, environmentID),
      this.findOneOrFail(assistantID),
      this.utterance.findManyByAssistant(assistantID, environmentID),
      this.attachment.findManyByAssistant(assistantID, environmentID),
      this.cardButton.findManyByAssistant(assistantID, environmentID),
      this.entityVariant.findManyByAssistant(assistantID, environmentID),
      this.requiredEntity.findManyByAssistant(assistantID, environmentID),
      this.responseVariant.findManyByAssistant(assistantID, environmentID),
      this.responseAttachment.findManyByAssistant(assistantID, environmentID),
      this.responseDiscriminator.findManyByAssistant(assistantID, environmentID),
      this.functionService.findManyByAssistant(assistantID, environmentID),
      this.functionPathService.findManyByAssistant(assistantID, environmentID),
      this.functionVariableService.findManyByAssistant(assistantID, environmentID),
    ]);

    return {
      stories,
      intents,
      prompts,
      entities,
      triggers,
      responses,
      assistant,
      utterances,
      attachments,
      cardButtons,
      entityVariants,
      requiredEntities,
      responseVariants,
      responseAttachments,
      responseDiscriminators,
      functions,
      functionPaths,
      functionVariables,
    };
  }

  public async deleteForLegacyProject(assistantID: string) {
    return RequestContext.createAsync(this.orm.em, async () => this.deleteOne(assistantID));
  }
}
