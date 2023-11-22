import { forwardRef, Module } from '@nestjs/common';
import { AssistantORM, ProgramORM, ProjectTemplateORM, PrototypeProgramORM } from '@voiceflow/orm-designer';

import { AttachmentModule } from '@/attachment/attachment.module';
import { CacheModule } from '@/cache/cache.module';
import { EntityModule } from '@/entity/entity.module';
import { EnvironmentModule } from '@/environment/environment.module';
import { FunctionModule } from '@/function/function.module';
import { IntentModule } from '@/intent/intent.module';
// eslint-disable-next-line import/no-cycle
import { ProjectModule } from '@/project/project.module';
import { ProjectListModule } from '@/project-list/project-list.module';
import { PromptModule } from '@/prompt/prompt.module';
import { ResponseModule } from '@/response/response.module';
import { StoryModule } from '@/story/story.module';
import { VariableStateModule } from '@/variable-state/variable-state.module';
import { VersionModule } from '@/version/version.module';

import { AssistantLoguxController } from './assistant.logux.controller';
import { AssistantSerializer } from './assistant.serializer';
import { AssistantService } from './assistant.service';
import { AssistantPrivateHTTPController } from './assistant-private.http.controller';
import { AssistantPublicHTTPController } from './assistant-public.http.controller';

@Module({
  imports: [
    ProgramORM.register(),
    AssistantORM.register(),
    ProjectTemplateORM.register(),
    PrototypeProgramORM.register(),
    forwardRef(() => ProjectModule),
    forwardRef(() => EnvironmentModule),
    StoryModule,
    CacheModule,
    EntityModule,
    IntentModule,
    PromptModule,
    VersionModule,
    ResponseModule,
    FunctionModule,
    AttachmentModule,
    ProjectListModule,
    VariableStateModule,
  ],
  exports: [AssistantService, AssistantSerializer],
  providers: [AssistantService, AssistantSerializer],
  controllers: [AssistantLoguxController, AssistantPublicHTTPController, AssistantPrivateHTTPController],
})
export class AssistantModule {}
