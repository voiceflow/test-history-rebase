import { Module } from '@nestjs/common';
import {
  AnyConditionORM,
  AnyResponseVariantORM,
  AssistantORM,
  PromptORM,
  ResponseDiscriminatorORM,
  ResponseJSONVariantORM,
  ResponseTextVariantORM,
} from '@voiceflow/orm-designer';

import { ResponseAttachmentModule } from '../response-attachment/response-attachment.module';
import { ResponseJSONVariantService } from './response-json-variant.service';
import { ResponseTextVariantService } from './response-text-variant.service';
import { ResponseVariantLoguxController } from './response-variant.logux.controller';
import { ResponseVariantService } from './response-variant.service';

@Module({
  imports: [ResponseAttachmentModule],
  exports: [ResponseVariantService, ResponseJSONVariantService, ResponseTextVariantService],
  providers: [
    PromptORM,
    AssistantORM,
    AnyConditionORM,
    AnyResponseVariantORM,
    ResponseTextVariantORM,
    ResponseJSONVariantORM,
    ResponseDiscriminatorORM,

    ResponseVariantService,
    ResponseJSONVariantService,
    ResponseTextVariantService,
  ],
  controllers: [ResponseVariantLoguxController],
})
export class ResponseVariantModule {}
