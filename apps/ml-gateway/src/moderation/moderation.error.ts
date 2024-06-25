import { BadRequestException } from '@voiceflow/exception';
import type { Moderation } from 'openai/resources/moderations';

interface ContentModerationErrorDataItem {
  input: string;
  error: Moderation;
}
export class ContentModerationError extends BadRequestException {
  constructor(public readonly data: ContentModerationErrorDataItem[]) {
    super(
      '[moderation error] Sorry, we can’t fulfill your request due to language or content in your message that violates our Terms of Service.'
    );
  }
}
