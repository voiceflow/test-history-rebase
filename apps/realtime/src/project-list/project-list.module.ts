import { Module } from '@nestjs/common';

import { ProjectListLoguxController } from './project-list.logux.controller';
import { ProjectListService } from './project-list.service';

@Module({
  controllers: [ProjectListLoguxController],
  providers: [ProjectListService],
  exports: [ProjectListService],
})
export class ProjectListModule {}
