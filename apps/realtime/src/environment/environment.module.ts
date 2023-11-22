import { Module } from '@nestjs/common';
import { AssistantORM, ProjectORM } from '@voiceflow/orm-designer';

import { AttachmentModule } from '@/attachment/attachment.module';
import { DiagramModule } from '@/diagram/diagram.module';
import { EntityModule } from '@/entity/entity.module';
import { EntityVariantModule } from '@/entity/entity-variant/entity-variant.module';
import { FunctionModule } from '@/function/function.module';
import { IntentModule } from '@/intent/intent.module';
import { RequiredEntityModule } from '@/intent/required-entity/required-entity.module';
import { UtteranceModule } from '@/intent/utterance/utterance.module';
import { ProjectSerializer } from '@/project/project.serializer';
import { PromptModule } from '@/prompt/prompt.module';
import { ResponseModule } from '@/response/response.module';
import { ResponseDiscriminatorModule } from '@/response/response-discriminator/response-discriminator.module';
import { ResponseVariantModule } from '@/response/response-variant/response-variant.module';
import { StoryModule } from '@/story/story.module';
import { VersionModule } from '@/version/version.module';

import { EnvironmentService } from './environment.service';
import { EnvironmentPrivateHTTPController } from './environment-private.http.controller';

@Module({
  imports: [
    ProjectORM.register(),
    AssistantORM.register(),
    StoryModule,
    EntityModule,
    IntentModule,
    PromptModule,
    VersionModule,
    DiagramModule,
    ResponseModule,
    FunctionModule,
    UtteranceModule,
    AttachmentModule,
    EntityVariantModule,
    RequiredEntityModule,
    ResponseVariantModule,
    ResponseDiscriminatorModule,
  ],
  exports: [EnvironmentService],
  providers: [EnvironmentService, ProjectSerializer],
  controllers: [EnvironmentPrivateHTTPController],
})
export class EnvironmentModule {}
