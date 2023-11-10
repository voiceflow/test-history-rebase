/* eslint-disable max-params */
import { RequestContext } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { HashedIDService } from '@voiceflow/nestjs-common';
import type { PKOrEntity, WorkspaceStubEntity } from '@voiceflow/orm-designer';
import { AssistantORM } from '@voiceflow/orm-designer';

import { AttachmentService } from '@/attachment/attachment.service';
import { MutableService } from '@/common';
import { CreateOneData } from '@/common/types';
import { EntityService } from '@/entity/entity.service';
import { FunctionService } from '@/function/function.service';
import { IntentService } from '@/intent/intent.service';
import { PromptService } from '@/prompt/prompt.service';
import { ResponseService } from '@/response/response.service';
import { StoryService } from '@/story/story.service';

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
    @Inject(PromptService)
    private readonly prompt: PromptService,
    @Inject(ResponseService)
    private readonly response: ResponseService,
    @Inject(HashedIDService)
    private readonly hashedID: HashedIDService,
    @Inject(AttachmentService)
    private readonly attachment: AttachmentService,
    @Inject(FunctionService)
    private readonly functionService: FunctionService,
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
      assistant,
      { stories, triggers },
      { prompts },
      { entities, entityVariants },
      { intents, utterances, requiredEntities },
      { responses, responseVariants, responseAttachments, responseDiscriminators },
      { attachments, cardButtons },
      { functions, functionPaths, functionVariables },
    ] = await Promise.all([
      this.findOneOrFail(assistantID),
      this.story.findManyWithSubResourcesByAssistant(assistantID, environmentID),
      this.prompt.findManyWithSubResourcesByAssistant(assistantID, environmentID),
      this.entity.findManyWithSubResourcesByAssistant(assistantID, environmentID),
      this.intent.findManyWithSubResourcesByAssistant(assistantID, environmentID),
      this.response.findManyWithSubResourcesByAssistant(assistantID, environmentID),
      this.attachment.findManyWithSubResourcesByAssistant(assistantID, environmentID),
      this.functionService.findManyWithSubResourcesByAssistant(assistantID, environmentID),
    ]);

    return {
      stories,
      intents,
      prompts,
      entities,
      triggers,
      functions,
      responses,
      assistant,
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
    };
  }

  public async deleteForLegacyProject(assistantID: string) {
    return RequestContext.createAsync(this.orm.em, async () => this.deleteOne(assistantID));
  }
}
