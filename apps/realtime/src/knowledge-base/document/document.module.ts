import { Module } from '@nestjs/common';
import { IntegrationOauthTokenORM, KnowledgeBaseORM, ProjectORM, RefreshJobsOrm } from '@voiceflow/orm-designer';
import { AuthClient } from '@voiceflow/sdk-auth';

import { KnowledgeBaseDocumentService } from './document.service';
import { KnowledgeBaseDocumentApiPublicHTTPController } from './document-api-public.http.controller';
import { KnowledgeBaseDocumentInternalPublicHTTPController } from './document-internal-public.http.controller';
import { RefreshJobService } from './refresh-job.service';

@Module({
  exports: [KnowledgeBaseDocumentService],
  providers: [AuthClient, KnowledgeBaseORM, KnowledgeBaseDocumentService, ProjectORM, RefreshJobsOrm, IntegrationOauthTokenORM, RefreshJobService],
  controllers: [KnowledgeBaseDocumentApiPublicHTTPController, KnowledgeBaseDocumentInternalPublicHTTPController],
})
export class KnowledgeBaseDocumentModule {}
