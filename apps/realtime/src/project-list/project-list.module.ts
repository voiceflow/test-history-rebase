import { Module } from '@nestjs/common';
import { WorkspaceProjectListsORM } from '@voiceflow/orm-designer';

import { ProjectListLoguxController } from './project-list.logux.controller';
import { ProjectListService } from './project-list.service';

@Module({
  imports: [WorkspaceProjectListsORM.register()],
  exports: [ProjectListService],
  providers: [ProjectListService],
  controllers: [ProjectListLoguxController],
})
export class ProjectListModule {}
