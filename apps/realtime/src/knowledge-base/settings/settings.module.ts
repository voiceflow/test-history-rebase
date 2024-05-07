import { Module } from '@nestjs/common';

import { KnowledgeBaseSettingsService } from './settings.service';
import { KnowledgeBaseSettingsPublicHTTPController } from './settings-public.http.controller';

@Module({
  exports: [KnowledgeBaseSettingsService],
  providers: [KnowledgeBaseSettingsService],
  controllers: [KnowledgeBaseSettingsPublicHTTPController],
})
export class KnowledgeBaseSettingsModule {}
