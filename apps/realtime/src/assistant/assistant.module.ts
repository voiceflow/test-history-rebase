import { forwardRef, Module } from '@nestjs/common';
import { AssistantORM, ProgramORM, PrototypeProgramORM } from '@voiceflow/orm-designer';

import { CacheModule } from '@/cache/cache.module';
// eslint-disable-next-line import/no-cycle
import { EnvironmentModule } from '@/environment/environment.module';
import { OrganizationModule } from '@/organization/organization.module';
import { ProgramModule } from '@/program/program.module';
import { ProjectModule } from '@/project/project.module';
import { ProjectListModule } from '@/project-list/project-list.module';
import { PrototypeProgramModule } from '@/prototype-program/prototype-program.module';
import { VariableStateModule } from '@/variable-state/variable-state.module';
import { VersionModule } from '@/version/version.module';

// eslint-disable-next-line import/no-cycle
import { BackupModule } from '../backup/backup.module';
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
    ProgramModule,
    VersionModule,
    ProjectListModule,
    VariableStateModule,
    PrototypeProgramModule,
    OrganizationModule,
  ],
  exports: [AssistantService, AssistantSerializer],
  providers: [ProgramORM, AssistantORM, PrototypeProgramORM, AssistantService, AssistantPublishService, AssistantViewerService, AssistantSerializer],
  controllers: [AssistantLoguxController, AssistantPublicHTTPController, AssistantPrivateHTTPController],
})
export class AssistantModule {}
