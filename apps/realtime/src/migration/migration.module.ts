import { Module } from '@nestjs/common';

import { AssistantModule } from '@/assistant/assistant.module';
import { EnvironmentModule } from '@/environment/environment.module';
import { LegacyModule } from '@/legacy/legacy.module';
import { ProjectModule } from '@/project/project.module';

import { MigrationCacheService } from './cache/cache.service';
import { MigrationLoguxController } from './migration.controller.logux';
import { MigrationService } from './migration.service';
import { SchemaService } from './schema/schema.service';

@Module({
  imports: [LegacyModule, ProjectModule, AssistantModule, EnvironmentModule],
  providers: [MigrationService, SchemaService, MigrationCacheService],
  controllers: [MigrationLoguxController],
})
export class MigrationModule {}
