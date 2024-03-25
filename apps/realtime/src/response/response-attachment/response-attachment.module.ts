import { Module } from '@nestjs/common';
import { AnyResponseAttachmentORM, AnyResponseVariantORM, ResponseCardAttachmentORM, ResponseMediaAttachmentORM } from '@voiceflow/orm-designer';

import { ResponseAttachmentLoguxController } from './response-attachment.logux.controller';
import { ResponseAttachmentService } from './response-attachment.service';
import { ResponseCardAttachmentService } from './response-card-attachment.service';
import { ResponseMediaAttachmentService } from './response-media-attachment.service';

@Module({
  controllers: [ResponseAttachmentLoguxController],
  providers: [
    AnyResponseVariantORM,
    AnyResponseAttachmentORM,
    ResponseCardAttachmentORM,
    ResponseMediaAttachmentORM,

    ResponseAttachmentService,
    ResponseCardAttachmentService,
    ResponseMediaAttachmentService,
  ],
  exports: [ResponseAttachmentService],
})
export class ResponseAttachmentModule {}
