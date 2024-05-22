import { Module } from '@nestjs/common';
import {
  AnyConditionORM,
  AnyResponseVariantORM,
  AssistantORM,
  PromptORM,
  ResponseDiscriminatorORM,
  ResponseTextVariantORM,
} from '@voiceflow/orm-designer';

import { ResponseAttachmentModule } from '../response-attachment/response-attachment.module';
import { ResponseTextVariantService } from './response-text-variant.service';
import { ResponseVariantLoguxController } from './response-variant.logux.controller';
import { ResponseVariantService } from './response-variant.service';

@Module({
  imports: [ResponseAttachmentModule],
  exports: [ResponseVariantService, ResponseTextVariantService],
  providers: [
    PromptORM,
    AssistantORM,
    AnyConditionORM,
    AnyResponseVariantORM,
    ResponseTextVariantORM,
    ResponseDiscriminatorORM,

    ResponseVariantService,
    ResponseTextVariantService,
  ],
  controllers: [ResponseVariantLoguxController],
})
export class ResponseVariantModule {}
