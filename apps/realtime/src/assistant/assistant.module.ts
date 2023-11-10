import { Module } from '@nestjs/common';
import { AssistantORM } from '@voiceflow/orm-designer';

import { AttachmentModule } from '@/attachment/attachment.module';
import { CacheModule } from '@/cache/cache.module';
import { EntityModule } from '@/entity/entity.module';
import { FunctionModule } from '@/function/function.module';
import { IntentModule } from '@/intent/intent.module';
import { PromptModule } from '@/prompt/prompt.module';
import { ResponseModule } from '@/response/response.module';
import { StoryModule } from '@/story/story.module';

import { AssistantLoguxController } from './assistant.logux.controller';
import { AssistantSerializer } from './assistant.serializer';
import { AssistantService } from './assistant.service';

@Module({
  imports: [
    AssistantORM.register(),
    StoryModule,
    CacheModule,
    EntityModule,
    IntentModule,
    PromptModule,
    ResponseModule,
    FunctionModule,
    AttachmentModule,
  ],
  exports: [AssistantService, AssistantSerializer],
  providers: [AssistantService, AssistantSerializer],
  controllers: [AssistantLoguxController],
})
export class AssistantModule {}
