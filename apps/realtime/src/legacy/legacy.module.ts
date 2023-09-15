import { Module } from '@nestjs/common';

import { EntityModule } from '../entity/entity.module';
import { IOServer } from './ioServer';
import { LegacyService } from './legacy.service';

@Module({
  imports: [EntityModule],
  providers: [LegacyService, IOServer],
})
export class LegacyModule {}
