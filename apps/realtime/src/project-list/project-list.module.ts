import { Module } from '@nestjs/common';
import { WorkspaceProjectListsORM } from '@voiceflow/orm-designer';

import { ProjectListLoguxController } from './project-list.logux.controller';
import { ProjectListService } from './project-list.service';

@Module({
  exports: [ProjectListService],
  providers: [WorkspaceProjectListsORM, ProjectListService],
  controllers: [ProjectListLoguxController],
})
export class ProjectListModule {}
