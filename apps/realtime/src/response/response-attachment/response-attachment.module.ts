import { Module } from '@nestjs/common';
import { ResponseAttachmentORM, ResponseCardAttachmentORM, ResponseMediaAttachmentORM, ResponseVariantORM } from '@voiceflow/orm-designer';

import { EntitySerializer } from '@/common';

import { ResponseAttachmentLoguxController } from './response-attachment.logux.controller';
import { ResponseAttachmentService } from './response-attachment.service';
import { ResponseCardAttachmentService } from './response-card-attachment.service';
import { ResponseMediaAttachmentService } from './response-media-attachment.service';

@Module({
  imports: [
    ResponseVariantORM.register(),
    ResponseAttachmentORM.register(),
    ResponseCardAttachmentORM.register(),
    ResponseMediaAttachmentORM.register(),
  ],
  controllers: [ResponseAttachmentLoguxController],
  providers: [EntitySerializer, ResponseAttachmentService, ResponseCardAttachmentService, ResponseMediaAttachmentService],
  exports: [ResponseAttachmentService],
})
export class ResponseAttachmentModule {}
