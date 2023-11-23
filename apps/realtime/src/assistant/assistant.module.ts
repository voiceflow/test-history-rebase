import { forwardRef, Module } from '@nestjs/common';
import { AssistantORM, ProgramORM, ProjectTemplateORM, PrototypeProgramORM } from '@voiceflow/orm-designer';

import { CacheModule } from '@/cache/cache.module';
import { DiagramModule } from '@/diagram/diagram.module';
import { EnvironmentModule } from '@/environment/environment.module';
// eslint-disable-next-line import/no-cycle
import { BackupModule } from '@/project/backup/backup.module';
// eslint-disable-next-line import/no-cycle
import { ProjectModule } from '@/project/project.module';
import { ProjectListModule } from '@/project-list/project-list.module';
import { VariableStateModule } from '@/variable-state/variable-state.module';
import { VersionModule } from '@/version/version.module';

import { AssistantLoguxController } from './assistant.logux.controller';
import { AssistantSerializer } from './assistant.serializer';
import { AssistantService } from './assistant.service';
import { AssistantPrivateHTTPController } from './assistant-private.http.controller';
import { AssistantPublicHTTPController } from './assistant-public.http.controller';
import { AssistantPublishService } from './assistant-publish.service';

@Module({
  imports: [
    ProgramORM.register(),
    AssistantORM.register(),
    ProjectTemplateORM.register(),
    PrototypeProgramORM.register(),
    forwardRef(() => BackupModule),
    forwardRef(() => ProjectModule),
    forwardRef(() => EnvironmentModule),
    CacheModule,
    DiagramModule,
    VersionModule,
    ProjectListModule,
    VariableStateModule,
  ],
  exports: [AssistantService, AssistantSerializer],
  providers: [AssistantService, AssistantPublishService, AssistantSerializer],
  controllers: [AssistantLoguxController, AssistantPublicHTTPController, AssistantPrivateHTTPController],
})
export class AssistantModule {}
