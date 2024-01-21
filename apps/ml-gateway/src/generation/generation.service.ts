import { Inject, Injectable } from '@nestjs/common';
import { AIModel } from '@voiceflow/dtos';

import { CompletionService } from '@/completion/completion.service';

import { GenerateEntityRepromptRequest } from './dtos/generate-entity-reprompt.request';
import { GenerateEntityValueRequest } from './dtos/generate-entity-value.request';
import { GeneratePromptRequest } from './dtos/generate-prompt.request';
import { GenerateUtteranceRequest } from './dtos/generate-utterance.request';
import { getEntityPromptPrompt } from './prompt/generate-entity-reprompt.prompt';
// prompts
import { getEntityValuePrompt } from './prompt/generate-entity-value.prompt';
import { getPromptPrompt } from './prompt/generate-prompt.prompt';
import { getUtterancePrompt } from './prompt/generate-utterance.prompt';

@Injectable()
export class GenerationService {
  static DEFAULT_COMPLETION = {
    params: { model: AIModel.GPT_3_5_TURBO_1106 },
    // no moderation for generation
    billing: true,
  };

  constructor(@Inject(CompletionService) private completion: CompletionService) {}

  async generatePrompt({ quantity, examples, locales, workspaceID }: GeneratePromptRequest): Promise<string[]> {
    const { prompt, parser } = getPromptPrompt(quantity, examples, locales?.[0]);

    const response = await this.completion.generateCompletion({
      workspaceID,
      prompt,
      ...GenerationService.DEFAULT_COMPLETION,
    });

    return parser(response?.output || '');
  }

  async generateUtterance({ quantity, intent, examples, locales, workspaceID }: GenerateUtteranceRequest) {
    const { prompt, parser } = getUtterancePrompt({ quantity, intentName: intent, examples, locale: locales?.[0] });

    const response = await this.completion.generateCompletion({
      workspaceID,
      prompt,
      ...GenerationService.DEFAULT_COMPLETION,
    });

    return parser(response?.output || '');
  }

  async generateEntityValue({ quantity, type, name, examples, locales, workspaceID }: GenerateEntityValueRequest) {
    const { prompt, parser } = getEntityValuePrompt({
      quantity,
      name,
      type,
      examples: examples?.flatMap((example) => example),
      locale: locales?.[0],
    });

    const response = await this.completion.generateCompletion({
      workspaceID,
      prompt,
      ...GenerationService.DEFAULT_COMPLETION,
    });

    return parser(response?.output || '');
  }

  async generateEntityReprompt({ quantity, name, examples, locales, workspaceID }: GenerateEntityRepromptRequest) {
    const { prompt, parser } = getEntityPromptPrompt({
      quantity,
      entityName: name,
      examples: examples?.flatMap((example) => example),
      locale: locales?.[0],
    });

    const response = await this.completion.generateCompletion({
      workspaceID,
      prompt,
      ...GenerationService.DEFAULT_COMPLETION,
    });

    return parser(response?.output || '');
  }
}
