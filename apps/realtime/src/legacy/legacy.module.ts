import { Module } from '@nestjs/common';

import { ProjectListModule } from '@/project-list/project-list.module';

import { IOServer } from './ioServer';
import { LegacyService } from './legacy.service';

@Module({
  imports: [ProjectListModule],
  providers: [LegacyService, IOServer],
})
export class LegacyModule {}
