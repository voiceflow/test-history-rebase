import { Module } from '@nestjs/common';
import { IntegrationOauthTokenORM, KnowledgeBaseORM, ProjectORM } from '@voiceflow/orm-designer';
import { KnowledgeBaseSettingsService } from './settings.service';
import { RefreshJobService } from '../document/refresh-job.service';
import { KnowledgeBaseSettingsPublicHTTPController } from './settings-public.http.controller';

@Module({
  exports: [KnowledgeBaseSettingsService],
  providers: [KnowledgeBaseORM, KnowledgeBaseSettingsService, ProjectORM, IntegrationOauthTokenORM, RefreshJobService],
  controllers: [KnowledgeBaseSettingsPublicHTTPController],
})
export class KnowledgeBaseSettingsModule {}
