import { Module } from '@nestjs/common';
import {
  AnyConditionORM,
  AnyResponseVariantORM,
  AssistantORM,
  ResponseDiscriminatorORM,
} from '@voiceflow/orm-designer';

import { ResponseVariantLoguxController } from './response-message.logux.controller';
import { ResponseMessageLoguxService } from './response-message.logux.service';
import { ResponseMessageRepository } from './response-message.repository';
import { ResponseMessageSerializer } from './response-message.serializer';
import { ResponseMessageService } from './response-message.service';

@Module({
  exports: [ResponseMessageService],
  providers: [
    AssistantORM,
    AnyConditionORM,
    AnyResponseVariantORM,
    ResponseDiscriminatorORM,

    ResponseMessageService,
    ResponseMessageLoguxService,
    ResponseMessageSerializer,
    ResponseMessageRepository,
  ],
  controllers: [ResponseVariantLoguxController],
})
export class ResponseMessageModule {}
