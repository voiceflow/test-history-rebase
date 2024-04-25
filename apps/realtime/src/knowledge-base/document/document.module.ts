import { Module } from '@nestjs/common';
import { KnowledgeBaseORM } from '@voiceflow/orm-designer';

import { KnowledgeBaseDocumentService } from './document.service';
import { KnowledgeBaseDocumentPublicHTTPController } from './document-public.http.controller';

@Module({
  exports: [KnowledgeBaseDocumentService],
  providers: [KnowledgeBaseORM, KnowledgeBaseDocumentService],
  controllers: [KnowledgeBaseDocumentPublicHTTPController],
})
export class KnowledgeBaseDocumentModule {}
