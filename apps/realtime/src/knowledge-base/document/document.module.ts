import { Module } from '@nestjs/common';
import { IntegrationOauthTokenORM, KnowledgeBaseORM, ProjectORM, RefreshJobsOrm } from '@voiceflow/orm-designer';
import { AuthClient } from '@voiceflow/sdk-auth';

import { KnowledgeBaseSettingsModule } from '@/knowledge-base/settings/settings.module';

import { KnowledgeBaseTagService } from '../tag/tag.service';
import { KnowledgeBaseDocumentService } from './document.service';
import { KnowledgeBaseDocumentApiPublicHTTPController } from './document-api-public.http.controller';
import { KnowledgeBaseDocumentInternalPublicHTTPController } from './document-internal-public.http.controller';
import { KnowledgeBaseDocumentPrivateHTTPController } from './document-private.http.contoller';
import { RefreshJobService } from './refresh-job.service';

@Module({
  imports: [KnowledgeBaseSettingsModule],
  exports: [KnowledgeBaseDocumentService],
  providers: [
    AuthClient,
    KnowledgeBaseORM,
    KnowledgeBaseDocumentService,
    ProjectORM,
    RefreshJobsOrm,
    IntegrationOauthTokenORM,
    RefreshJobService,
    KnowledgeBaseTagService,
  ],
  controllers: [
    KnowledgeBaseDocumentInternalPublicHTTPController,
    KnowledgeBaseDocumentApiPublicHTTPController,
    KnowledgeBaseDocumentPrivateHTTPController,
  ],
})
export class KnowledgeBaseDocumentModule {}
