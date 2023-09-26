import { Module } from '@nestjs/common';

import { CacheModule } from '@/cache/cache.module';
import { DiagramModule } from '@/diagram/diagram.module';
import { LegacyModule } from '@/legacy/legacy.module';
import { ProjectModule } from '@/project/project.module';
import { VersionModule } from '@/version/version.module';

import { MigrationLoguxController } from './migration.controller.logux';
import { MigrationService } from './migration.service';
import { SchemaService } from './schema.service';

@Module({
  imports: [LegacyModule, DiagramModule, VersionModule, CacheModule, ProjectModule],
  providers: [MigrationService, SchemaService],
  exports: [MigrationService],
  controllers: [MigrationLoguxController],
})
export class MigrationModule {}
