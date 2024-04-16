import { Module } from '@nestjs/common';
import { KnowledgeBaseORM } from '@voiceflow/orm-designer';

import { KnowledgeBaseDocumentLoguxController } from './document.logux.controller';
import { KnowledgeBaseDocumentService } from './document.service';

@Module({
  exports: [KnowledgeBaseDocumentService],
  providers: [KnowledgeBaseORM, KnowledgeBaseDocumentService],
  controllers: [KnowledgeBaseDocumentLoguxController],
})
export class KnowledgeBaseDocumentModule {}
