import { Module } from '@nestjs/common';
import { IntegrationOauthTokenORM, KnowledgeBaseORM, ProjectORM, RefreshJobsOrm } from '@voiceflow/orm-designer';

import { KnowledgeBaseDocumentService } from './document.service';
import { KnowledgeBaseDocumentPublicHTTPController } from './document-public.http.controller';
import { RefreshJobService } from './refresh-job.service';

@Module({
  exports: [KnowledgeBaseDocumentService],
  providers: [KnowledgeBaseORM, KnowledgeBaseDocumentService, ProjectORM, RefreshJobsOrm, IntegrationOauthTokenORM, RefreshJobService],
  controllers: [KnowledgeBaseDocumentPublicHTTPController],
})
export class KnowledgeBaseDocumentModule {}
