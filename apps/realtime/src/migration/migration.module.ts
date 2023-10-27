import { Module } from '@nestjs/common';

import { DiagramModule } from '@/diagram/diagram.module';
import { LegacyModule } from '@/legacy/legacy.module';
import { ProjectModule } from '@/project/project.module';
import { VersionModule } from '@/version/version.module';

import { MigrationCacheService } from './cache/cache.service';
import { MigrationLoguxController } from './migration.controller.logux';
import { MigrationService } from './migration.service';
import { SchemaService } from './schema/schema.service';

@Module({
  imports: [LegacyModule, DiagramModule, VersionModule, ProjectModule],
  providers: [MigrationService, SchemaService, MigrationCacheService],
  controllers: [MigrationLoguxController],
})
export class MigrationModule {}
