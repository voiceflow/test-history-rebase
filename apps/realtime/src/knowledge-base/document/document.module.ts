import { Module } from '@nestjs/common';
import { IntegrationOauthTokenORM, KnowledgeBaseORM, ProjectORM, RefreshJobsOrm } from '@voiceflow/orm-designer';
import { AuthClient } from '@voiceflow/sdk-auth';

import { KnowledgeBaseTagService } from '../tag/tag.service';
import { KnowledgeBaseDocumentService } from './document.service';
import { KnowledgeBaseDocumentApiPublicHTTPController } from './document-api-public.http.controller';
import { KnowledgeBaseDocumentInternalPublicHTTPController } from './document-internal-public.http.controller';
import { RefreshJobService } from './refresh-job.service';

@Module({
  exports: [KnowledgeBaseDocumentService],
  providers: [
    AuthClient,
    KnowledgeBaseORM,
    KnowledgeBaseDocumentService,
    ProjectORM,
    RefreshJobsOrm,
    RefreshJobService,
    IntegrationOauthTokenORM,
    KnowledgeBaseTagService,
  ],
  controllers: [KnowledgeBaseDocumentInternalPublicHTTPController, KnowledgeBaseDocumentApiPublicHTTPController],
})
export class KnowledgeBaseDocumentModule {}
