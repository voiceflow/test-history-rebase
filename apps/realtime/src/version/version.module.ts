import { Module } from '@nestjs/common';

import { LegacyModule } from '@/legacy/legacy.module';
import { MigrationModule } from '@/migration/migration.module';
import { ProjectModule } from '@/project/project.module';

import { VersionsLoguxController } from './version.controller.logux';
import { VersionORM } from './version.orm';
import { VersionService } from './version.service';

@Module({
  imports: [LegacyModule, MigrationModule, ProjectModule],
  providers: [VersionORM, VersionService],
  controllers: [VersionsLoguxController],
})
export class VersionModule {}
