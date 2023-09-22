import { Module } from '@nestjs/common';

import { IOServer } from './ioServer';
import { LegacyLoguxController } from './legacy.controller.logux';
import { LegacyService } from './legacy.service';
import { MigrationService } from './migration.service';

@Module({
  providers: [MigrationService, LegacyService, IOServer],
  controllers: [LegacyLoguxController],
})
export class LegacyModule {}
