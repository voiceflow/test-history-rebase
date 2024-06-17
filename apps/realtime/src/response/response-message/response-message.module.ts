import { Module } from '@nestjs/common';
import {
  AnyConditionORM,
  AnyResponseVariantORM,
  AssistantORM,
  ResponseDiscriminatorORM,
  ResponseMessageORM,
} from '@voiceflow/orm-designer';

import { ResponseMessageDiscriminatorsSyncService } from './discriminators-sync.service';
import { ResponseVariantLoguxController } from './response-message.logux.controller';
import { ResponseMessageLoguxService } from './response-message.logux.service';
import { ResponseMessageRepository } from './response-message.repository';
import { ResponseMessageSerializer } from './response-message.serializer';
import { ResponseMessageService } from './response-message.service';

@Module({
  exports: [ResponseMessageService, ResponseMessageRepository, ResponseMessageLoguxService],
  providers: [
    AssistantORM,
    AnyConditionORM,
    AnyResponseVariantORM,
    ResponseDiscriminatorORM,
    ResponseMessageORM,

    ResponseMessageService,
    ResponseMessageLoguxService,
    ResponseMessageSerializer,
    ResponseMessageRepository,
    ResponseMessageDiscriminatorsSyncService,
  ],
  controllers: [ResponseVariantLoguxController],
})
export class ResponseMessageModule {}
