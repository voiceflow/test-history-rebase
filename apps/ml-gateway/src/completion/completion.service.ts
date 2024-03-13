import { Inject, Injectable } from '@nestjs/common';

import { LLMService } from '@/llm/llm.service';
import { ModerationService } from '@/moderation/moderation.service';

import type { ChatCompletionRequest } from './dtos/chat-completion.request';
import type { CompletionRequest } from './dtos/completion.request';

@Injectable()
export class CompletionService {
  constructor(
    @Inject(LLMService) private llm: LLMService,
    @Inject(ModerationService) private moderation: ModerationService,
  ) {}

  async * generateCompletion({prompt, params, options, moderation, workspaceID, projectID}: CompletionRequest) {
    if (moderation) {
      await this.moderation.checkModeration((params?.system || '') + prompt, { workspaceID, projectID });
    }

    yield * this.llm.get(params?.model).generateCompletion(prompt, params, options);
  }

  async * generateChatCompletion({messages, params, options, moderation, workspaceID, projectID}: ChatCompletionRequest) {
    if (moderation) {
      await this.moderation.checkModeration(JSON.stringify(messages), { workspaceID, projectID });
    }

    yield * this.llm.get(params?.model).generateChatCompletion(messages, params, options);
  }
}
