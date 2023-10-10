import { Module } from '@nestjs/common';

import { AssistantModule } from '@/assistant/assistant.module';
import { AttachmentModule } from '@/attachment/attachment.module';

import { UploadHTTPController } from './upload.http.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [AssistantModule, AttachmentModule],
  exports: [UploadService],
  providers: [UploadService],
  controllers: [UploadHTTPController],
})
export class UploadModule {}
