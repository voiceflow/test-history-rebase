import { Module } from '@nestjs/common';

import { ProjectListModule } from '@/project-list/project-list.module';

import { IOServer } from './ioServer';
import { LegacyService } from './legacy.service';

@Module({
  imports: [ProjectListModule],
  providers: [LegacyService, IOServer],
  exports: [LegacyService],
})
export class LegacyModule {}
