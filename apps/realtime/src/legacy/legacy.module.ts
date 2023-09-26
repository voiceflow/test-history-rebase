import { Module } from '@nestjs/common';

import { IOServer } from './ioServer';
import { LegacyService } from './legacy.service';

@Module({
  providers: [LegacyService, IOServer],
  exports: [LegacyService],
})
export class LegacyModule {}
