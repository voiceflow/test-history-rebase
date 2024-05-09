import { Module } from '@nestjs/common';
import { KnowledgeBaseORM } from '@voiceflow/orm-designer';

import { ProjectModule } from '@/project/project.module';
import { VersionModule } from '@/version/version.module';

import { KnowledgeBaseSettingsService } from './settings.service';
import { KnowledgeBaseSettingsPublicHTTPController } from './settings-public.http.controller';
import { KnowledgeBaseVersionSettingsPublicHTTPController } from './version-settings-public.http.controller';

@Module({
  imports: [VersionModule, ProjectModule],
  exports: [KnowledgeBaseSettingsService],
  providers: [KnowledgeBaseORM, KnowledgeBaseSettingsService],
  controllers: [KnowledgeBaseSettingsPublicHTTPController, KnowledgeBaseVersionSettingsPublicHTTPController],
})
export class KnowledgeBaseSettingsModule {}
