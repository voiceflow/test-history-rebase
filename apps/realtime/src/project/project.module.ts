import { Module } from '@nestjs/common';
import { ProjectORM, VersionIntentORM, VersionSlotORM } from '@voiceflow/orm-designer';

import { AssistantModule } from '@/assistant/assistant.module';
import { CacheModule } from '@/cache/cache.module';
import { DiagramModule } from '@/diagram/diagram.module';
import { LegacyModule } from '@/legacy/legacy.module';
import { ProjectListModule } from '@/project-list/project-list.module';
import { VariableStateModule } from '@/variable-state/variable-state.module';
import { VersionModule } from '@/version/version.module';

import { ProjectHTTPController } from './project.http.controller';
import { ProjectLoguxController } from './project.logux.controller';
import { ProjectSerializer } from './project.serializer';
import { ProjectService } from './project.service';
import { LegacyProjectSerializer } from './project-legacy/legacy-project.serializer';
import { ProjectLegacyService } from './project-legacy/project-legacy.service';
import { ProjectMemberModule } from './project-member/project-member.module';
import ProjectMemberService from './project-member/project-member.service';
import { ProjectMergeService } from './project-merge.service';

@Module({
  imports: [
    ProjectORM.register(),
    VersionSlotORM.register(),
    VersionIntentORM.register(),
    LegacyModule,
    VersionModule,
    DiagramModule,
    ProjectListModule,
    VariableStateModule,
    CacheModule,
    AssistantModule,
    ProjectMemberModule,
  ],
  exports: [ProjectService, ProjectMemberService, ProjectLegacyService, ProjectSerializer],
  providers: [ProjectService, ProjectSerializer, LegacyProjectSerializer, ProjectLegacyService, ProjectMemberService, ProjectMergeService],
  controllers: [ProjectLoguxController, ProjectHTTPController],
})
export class ProjectModule {}
