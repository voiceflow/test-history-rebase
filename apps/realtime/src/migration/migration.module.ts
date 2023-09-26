import { Module } from '@nestjs/common';

import { LegacyModule } from '@/legacy/legacy.module';

import { MigrationService } from './migration.service';

@Module({
  imports: [LegacyModule],
  providers: [MigrationService],
  exports: [MigrationService],
})
export class MigrationModule {}
