import { Module } from '@nestjs/common';
import { KnowledgeBaseORM, ProjectORM, VersionORM } from '@voiceflow/orm-designer';

import { CacheService } from '@/cache/cache.service';

import { KnowledgeBaseSettingsService } from './settings.service';
import { KnowledgeBaseSettingsPrivateHTTPController } from './settings-private.http.controller';
import { KnowledgeBaseSettingsPublicHTTPController } from './settings-public.http.controller';
import { KnowledgeBaseVersionSettingsPublicHTTPController } from './version-settings-public.http.controller';

@Module({
  imports: [],
  exports: [KnowledgeBaseSettingsService],
  providers: [KnowledgeBaseORM, ProjectORM, VersionORM, KnowledgeBaseSettingsService, CacheService],
  controllers: [
    KnowledgeBaseSettingsPublicHTTPController,
    KnowledgeBaseVersionSettingsPublicHTTPController,
    KnowledgeBaseSettingsPrivateHTTPController,
  ],
})
export class KnowledgeBaseSettingsModule {}
