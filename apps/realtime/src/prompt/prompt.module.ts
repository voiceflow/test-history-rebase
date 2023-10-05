import { Module } from '@nestjs/common';
import { AssistantORM, FolderORM, PersonaOverrideORM, PromptORM, ResponsePromptVariantORM } from '@voiceflow/orm-designer';

import { PromptLoguxController } from './prompt.logux.controller';
import { PromptService } from './prompt.service';

@Module({
  imports: [FolderORM.register(), PromptORM.register(), AssistantORM.register(), PersonaOverrideORM.register(), ResponsePromptVariantORM.register()],
  exports: [PromptService],
  providers: [PromptService],
  controllers: [PromptLoguxController],
})
export class PromptModule {}
