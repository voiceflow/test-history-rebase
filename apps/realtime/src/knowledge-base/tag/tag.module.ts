import { Module } from '@nestjs/common';
import { KnowledgeBaseORM } from '@voiceflow/orm-designer';

import { KnowledgeBaseTagService } from './tag.service';
import { KnowledgeBaseTagPublicHTTPController } from './tags-public.http.controller';

@Module({
  exports: [KnowledgeBaseTagService],
  providers: [KnowledgeBaseORM, KnowledgeBaseTagService],
  controllers: [KnowledgeBaseTagPublicHTTPController],
})
export class KnowledgeBaseTagModule {}
