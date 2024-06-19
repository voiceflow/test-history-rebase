import { Module } from '@nestjs/common';

import { CacheModule } from '@/cache/cache.module';
import { LegacyModule } from '@/legacy/legacy.module';

import { WorkspaceConnectedProjectsService } from './connected-projects.service';

@Module({
  imports: [LegacyModule, CacheModule],
  providers: [WorkspaceConnectedProjectsService],
  exports: [WorkspaceConnectedProjectsService],
})
export class WorkspaceConnectedProjectsModule {}
