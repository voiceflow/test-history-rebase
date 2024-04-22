import { Module } from '@nestjs/common';
import { KnowledgeBaseORM } from '@voiceflow/orm-designer';

import { KnowledgeBaseDocumentService } from './document.service';
import { KnowledgeBaseDocumentPrivateHTTPController } from './document-private.http.controller';

@Module({
  exports: [KnowledgeBaseDocumentService],
  providers: [KnowledgeBaseORM, KnowledgeBaseDocumentService],
  controllers: [KnowledgeBaseDocumentPrivateHTTPController],
})
export class KnowledgeBaseDocumentModule {}
