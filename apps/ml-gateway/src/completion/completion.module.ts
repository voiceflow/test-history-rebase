import { Module } from '@nestjs/common';

import { LLMModule } from '@/llm/llm.module';
import { ModerationModule } from '@/moderation/moderation.module';

import { CompletionService } from './completion.service';
import { CompletionPrivateHTTPController } from './completion-private.http.controller';

@Module({
  imports: [LLMModule, ModerationModule],
  exports: [CompletionService],
  providers: [CompletionService],
  controllers: [CompletionPrivateHTTPController],
})
export class CompletionModule {}
