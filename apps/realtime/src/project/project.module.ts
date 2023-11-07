import { Module } from '@nestjs/common';
import { ProjectORM, VersionIntentORM, VersionSlotORM } from '@voiceflow/orm-designer';

import { AssistantModule } from '@/assistant/assistant.module';
import { CacheModule } from '@/cache/cache.module';
import { DiagramModule } from '@/diagram/diagram.module';
import { LegacyModule } from '@/legacy/legacy.module';
import { ProjectListModule } from '@/project-list/project-list.module';
import { VariableStateModule } from '@/variable-state/variable-state.module';
import { VersionModule } from '@/version/version.module';

import { LegacyProjectSerializer } from './legacy/legacy-project.serializer';
import { ProjectLegacyService } from './legacy/project-legacy.service';
import { ProjectMemberModule } from './member/project-member.module';
import ProjectMemberService from './member/project-member.service';
import { ProjectMergeService } from './merge/project-merge.service';
import { ProjectHTTPController } from './project.http.controller';
import { ProjectLoguxController } from './project.logux.controller';
import { ProjectSerializer } from './project.serializer';
import { ProjectService } from './project.service';

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
  exports: [ProjectService, ProjectMemberService, ProjectLegacyService],
  providers: [ProjectService, ProjectSerializer, LegacyProjectSerializer, ProjectLegacyService, ProjectMemberService, ProjectMergeService],
  controllers: [ProjectLoguxController, ProjectHTTPController],
})
export class ProjectModule {}
