import { Module } from '@nestjs/common';
import { AssistantORM } from '@voiceflow/orm-designer';

import { AttachmentModule } from '@/attachment/attachment.module';
import { CardButtonModule } from '@/attachment/card-button/card-button.module';
import { CacheModule } from '@/cache/cache.module';
import { EntityModule } from '@/entity/entity.module';
import { EntityVariantModule } from '@/entity/entity-variant/entity-variant.module';
import { FunctionModule } from '@/function/function.module';
import { FunctionPathModule } from '@/function/function-path/function-path.module';
import { FunctionVariableModule } from '@/function/function-variable/function-variable.module';
import { IntentModule } from '@/intent/intent.module';
import { RequiredEntityModule } from '@/intent/required-entity/required-entity.module';
import { UtteranceModule } from '@/intent/utterance/utterance.module';
import { PromptModule } from '@/prompt/prompt.module';
import { ResponseModule } from '@/response/response.module';
import { ResponseAttachmentModule } from '@/response/response-attachment/response-attachment.module';
import { ResponseDiscriminatorModule } from '@/response/response-discriminator/response-discriminator.module';
import { ResponseVariantModule } from '@/response/response-variant/response-variant.module';
import { StoryModule } from '@/story/story.module';
import { TriggerModule } from '@/story/trigger/trigger.module';

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
    TriggerModule,
    ResponseModule,
    UtteranceModule,
    AttachmentModule,
    CardButtonModule,
    EntityVariantModule,
    RequiredEntityModule,
    ResponseVariantModule,
    ResponseAttachmentModule,
    ResponseDiscriminatorModule,
    FunctionModule,
    FunctionPathModule,
    FunctionVariableModule,
  ],
  exports: [AssistantService, AssistantSerializer],
  providers: [AssistantService, AssistantSerializer],
  controllers: [AssistantLoguxController],
})
export class AssistantModule {}
