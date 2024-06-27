import { forwardRef, Module } from '@nestjs/common';
import { AssistantORM, ProgramORM, PrototypeProgramORM } from '@voiceflow/orm-designer';

import { BackupModule } from '@/backup/backup.module';
import { CacheModule } from '@/cache/cache.module';
import { DiagramModule } from '@/diagram/diagram.module';
import { EnvironmentModule } from '@/environment/environment.module';
import { KnowledgeBaseSettingsModule } from '@/knowledge-base/settings/settings.module';
import { OrganizationModule } from '@/organization/organization.module';
import { ProgramModule } from '@/program/program.module';
import { ProjectModule } from '@/project/project.module';
import { ProjectListModule } from '@/project-list/project-list.module';
import { PrototypeProgramModule } from '@/prototype-program/prototype-program.module';
import { ReferenceModule } from '@/reference/reference.module';
import { ThreadModule } from '@/thread/thread.module';
import { VariableStateModule } from '@/variable-state/variable-state.module';
import { VersionModule } from '@/version/version.module';

import { AssistantLoguxController } from './assistant.logux.controller';
import { AssistantSerializer } from './assistant.serializer';
import { AssistantService } from './assistant.service';
import { AssistantPrivateHTTPController } from './assistant-private.http.controller';
import { AssistantPublicHTTPController } from './assistant-public.http.controller';
import { AssistantPublishService } from './assistant-publish.service';
import { AssistantViewerService } from './assistant-viewer.service';

@Module({
  imports: [
    forwardRef(() => BackupModule),
    forwardRef(() => ProjectModule),
    forwardRef(() => EnvironmentModule),
    CacheModule,
    ThreadModule,
    DiagramModule,
    ProgramModule,
    VersionModule,
    ReferenceModule,
    ProjectListModule,
    OrganizationModule,
    VariableStateModule,
    PrototypeProgramModule,
    KnowledgeBaseSettingsModule,
  ],
  exports: [AssistantService, AssistantSerializer],
  providers: [
    ProgramORM,
    AssistantORM,
    PrototypeProgramORM,
    AssistantService,
    AssistantViewerService,
    AssistantPublishService,
    AssistantSerializer,
  ],
  controllers: [AssistantLoguxController, AssistantPublicHTTPController, AssistantPrivateHTTPController],
})
export class AssistantModule {}
