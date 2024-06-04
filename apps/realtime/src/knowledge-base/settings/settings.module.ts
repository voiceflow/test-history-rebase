import { Module } from '@nestjs/common';
import { KnowledgeBaseORM, ProjectORM } from '@voiceflow/orm-designer';

import { CacheService } from '@/cache/cache.service';
import { ProjectModule } from '@/project/project.module';
import { VersionModule } from '@/version/version.module';

import { KnowledgeBaseSettingsService } from './settings.service';
import { KnowledgeBaseSettingsPrivateHTTPController } from './settings-private.http.controller';
import { KnowledgeBaseSettingsPublicHTTPController } from './settings-public.http.controller';
import { KnowledgeBaseVersionSettingsPublicHTTPController } from './version-settings-public.http.controller';

@Module({
  imports: [VersionModule, ProjectModule],
  exports: [KnowledgeBaseSettingsService],
  providers: [KnowledgeBaseORM, ProjectORM, KnowledgeBaseSettingsService, CacheService],
  controllers: [
    KnowledgeBaseSettingsPublicHTTPController,
    KnowledgeBaseVersionSettingsPublicHTTPController,
    KnowledgeBaseSettingsPrivateHTTPController,
  ],
})
export class KnowledgeBaseSettingsModule {}
