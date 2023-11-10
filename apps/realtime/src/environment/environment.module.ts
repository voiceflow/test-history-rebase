import { Module } from '@nestjs/common';
import { AssistantORM } from '@voiceflow/orm-designer';

import { AttachmentModule } from '@/attachment/attachment.module';
import { DiagramModule } from '@/diagram/diagram.module';
import { EntityModule } from '@/entity/entity.module';
import { FunctionModule } from '@/function/function.module';
import { IntentModule } from '@/intent/intent.module';
import { ProjectModule } from '@/project/project.module';
import { PromptModule } from '@/prompt/prompt.module';
import { ResponseModule } from '@/response/response.module';
import { StoryModule } from '@/story/story.module';
import { VersionModule } from '@/version/version.module';

import { EnvironmentService } from './environment.service';
import { EnvironmentPrivateHTTPController } from './environment-private.http.controller';

@Module({
  imports: [
    AssistantORM.register(),
    StoryModule,
    EntityModule,
    IntentModule,
    PromptModule,
    VersionModule,
    DiagramModule,
    ProjectModule,
    ResponseModule,
    FunctionModule,
    AttachmentModule,
  ],
  exports: [EnvironmentService],
  providers: [EnvironmentService],
  controllers: [EnvironmentPrivateHTTPController],
})
export class EnvironmentModule {}
