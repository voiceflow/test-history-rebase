import { Inject, Injectable, Logger } from '@nestjs/common';
import { ENVIRONMENT_VARIABLES } from '@voiceflow/nestjs-env';
import { OpenAI } from 'openai';

import type { EnvironmentVariables } from '@/app.env';

import { ContentModerationError } from './moderation.error';

@Injectable()
export class ModerationService {
  private logger = new Logger(ModerationService.name);

  protected openAIClient?: OpenAI;

  constructor(
    @Inject(ENVIRONMENT_VARIABLES)
    env: EnvironmentVariables
  ) {
    if (!env.OPENAI_API_KEY) {
      this.logger.warn('OpenAI API key is not set, content moderation will be ignored');
    }

    // this.openAIClient = new OpenAIApi(new Configuration({ apiKey: env.OPENAI_API_KEY, basePath: env.OPENAI_API_ENDPOINT || undefined }));
  }

  async checkModeration(input: string | string[], context: Partial<{ workspaceID: string | number; projectID: string }> = {}) {
    // if the OPENAI_API_KEY is not set, the content moderation is just ignored
    if (!this.openAIClient) return;

    if (!input?.length) return;
    const moderationResult = await this.openAIClient.moderations.create({ input });

    const failedModeration = moderationResult.results.flatMap((result, idx) => {
      if (result.flagged) {
        return [
          {
            input: Array.isArray(input) ? input[idx] : input,
            projectID: context.projectID,
            workspaceID: context.workspaceID,
            error: result,
          },
        ];
      }
      return [];
    });

    failedModeration.forEach((failedModeration) => {
      const failedModerationCategories = Object.entries(failedModeration.error.categories).reduce<string[]>((acc, [key, value]) => {
        if (value) acc.push(key);
        return acc;
      }, []);
      this.logger.warn(
        `[moderation error]input=${failedModeration.input} | categories=${failedModerationCategories} | projectID=${context.projectID} | workspaceID=${context.workspaceID}`
      );
    });

    if (failedModeration.length) {
      throw new ContentModerationError(failedModeration);
    }
  }
}
