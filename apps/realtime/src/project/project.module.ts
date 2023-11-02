import { Module } from '@nestjs/common';
import { ProjectORM, VersionIntentORM, VersionSlotORM } from '@voiceflow/orm-designer';

import { DiagramModule } from '@/diagram/diagram.module';
import { LegacyModule } from '@/legacy/legacy.module';
import { ProjectListModule } from '@/project-list/project-list.module';
import { VariableStateModule } from '@/variable-state/variable-state.module';
import { VersionModule } from '@/version/version.module';

import { LegacyProjectSerializer } from './legacy/legacy-project.serializer';
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
  ],
  exports: [ProjectService],
  providers: [ProjectService, ProjectSerializer, LegacyProjectSerializer],
  controllers: [ProjectLoguxController, ProjectHTTPController],
})
export class ProjectModule {}
