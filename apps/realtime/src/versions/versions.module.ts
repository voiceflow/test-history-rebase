import { Module } from '@nestjs/common';

import { LegacyModule } from '@/legacy/legacy.module';

import { VersionsLoguxController } from './versions.controller.logux';
import { VersionsService } from './versions.service';

@Module({
  imports: [LegacyModule],
  providers: [VersionsService],
  controllers: [VersionsLoguxController],
})
export class VersionsModule {}
