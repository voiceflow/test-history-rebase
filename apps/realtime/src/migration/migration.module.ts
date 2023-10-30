import { Module } from '@nestjs/common';

import { LegacyModule } from '@/legacy/legacy.module';
import { ProjectModule } from '@/project/project.module';

import { MigrationCacheService } from './cache/cache.service';
import { MigrationLoguxController } from './migration.controller.logux';
import { MigrationService } from './migration.service';
import { SchemaService } from './schema/schema.service';

@Module({
  imports: [LegacyModule, ProjectModule],
  providers: [MigrationService, SchemaService, MigrationCacheService],
  controllers: [MigrationLoguxController],
})
export class MigrationModule {}
