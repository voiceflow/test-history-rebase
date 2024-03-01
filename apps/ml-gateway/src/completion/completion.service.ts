import { Inject, Injectable, Logger } from '@nestjs/common';
import { BadRequestException } from '@voiceflow/exception';
import { BillingClient } from '@voiceflow/sdk-billing';

import { LLMService } from '@/llm/llm.service';
import { CompletionOutput } from '@/llm/llm-model.dto';
import { ModerationService } from '@/moderation/moderation.service';

import type { ChatCompletionRequest } from './dtos/chat-completion.request';
import type { BaseCompletionRequest, CompletionRequest } from './dtos/completion.request';

@Injectable()
export class CompletionService {
  private logger = new Logger(CompletionService.name);

  constructor(
    @Inject(LLMService) private llm: LLMService,
    @Inject(ModerationService) private moderation: ModerationService,
    @Inject(BillingClient) private billing: BillingClient
  ) {}

  private checkQuota(workspaceID: string | number): Promise<boolean> {
    // Consume count of zero to check if quota has not been exceeded
    return this.billing.authorizationPrivate
      .authorize({
        resourceType: 'workspace',
        resourceID: String(workspaceID),
        item: 'addon-tokens',
        value: 0,
      })
      .then(() => true)
      .catch(() => false);
  }

  private consumeQuota(workspaceID: string | number, count: number) {
    // do this async to not block the response
    return this.billing.usagesPrivate
      .trackUsage({
        resourceType: 'workspace',
        resourceID: String(workspaceID),
        item: 'addon-tokens',
        value: count,
      })
      .catch((error) => {
        this.logger.error(error, `[checkQuotaWrapper] error consuming quota for workspace ${workspaceID}`);
      });
  }

  private async checkQuotaWrapper<R extends BaseCompletionRequest>(
    request: R,
    completion: (request: R) => Promise<CompletionOutput>
  ): Promise<CompletionOutput> {
    if (request.billing && !(await this.checkQuota(request.workspaceID))) {
      throw new BadRequestException('Quota exceeded');
    }

    // run the actual completion with LLM
    const result = await completion(request);

    if (request.billing && result?.tokens) {
      this.consumeQuota(request.workspaceID, result.tokens);
    }

    return result;
  }

  async generateCompletion(request: CompletionRequest) {
    return this.checkQuotaWrapper(request, async ({ prompt, params, options, moderation, workspaceID, projectID }) => {
      if (moderation) {
        await this.moderation.checkModeration((params?.system || '') + prompt, { workspaceID, projectID });
      }

      return this.llm.get(params?.model).generateCompletion(prompt, params, options);
    });
  }

  async generateChatCompletion(request: ChatCompletionRequest) {
    return this.checkQuotaWrapper(request, async ({ messages, params, options, moderation, workspaceID, projectID }) => {
      if (moderation) {
        await this.moderation.checkModeration(JSON.stringify(messages), { workspaceID, projectID });
      }

      return this.llm.get(params?.model).generateChatCompletion(messages, params, options);
    });
  }
}
