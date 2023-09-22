import { Module } from '@nestjs/common';

import { ProjectListModule } from '@/project-list/project-list.module';

import { IOServer } from './ioServer';
import { LegacyLoguxController } from './legacy.controller.logux';
import { LegacyService } from './legacy.service';
import { MigrationService } from './migration.service';

@Module({
  imports: [ProjectListModule],
  providers: [MigrationService, LegacyService, IOServer],
  controllers: [LegacyLoguxController],
})
export class LegacyModule {}
