import { Module } from '@nestjs/common';
import { AssistantORM, CardAttachmentORM, MediaAttachmentORM } from '@voiceflow/orm-designer';

import { ResponseAttachmentModule } from '@/response/response-attachment/response-attachment.module';

import { AttachmentLoguxController } from './attachment.logux.controller';
import { AttachmentService } from './attachment.service';
import { CardAttachmentService } from './card-attachment.service';
import { CardButtonModule } from './card-button/card-button.module';
import { MediaAttachmentService } from './media-attachment.service';

@Module({
  imports: [CardButtonModule, ResponseAttachmentModule],
  exports: [AttachmentService],
  providers: [
    AssistantORM,
    CardAttachmentORM,
    MediaAttachmentORM,
    AttachmentService,
    CardAttachmentService,
    MediaAttachmentService,
  ],
  controllers: [AttachmentLoguxController],
})
export class AttachmentModule {}
