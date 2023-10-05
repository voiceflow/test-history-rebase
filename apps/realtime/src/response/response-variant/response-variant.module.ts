import { Module } from '@nestjs/common';
import {
  AssistantORM,
  ConditionORM,
  PromptORM,
  ResponseDiscriminatorORM,
  ResponseJSONVariantORM,
  ResponsePromptVariantORM,
  ResponseTextVariantORM,
  ResponseVariantORM,
} from '@voiceflow/orm-designer';

import { EntitySerializer } from '@/common';

import { PromptModule } from '../../prompt/prompt.module';
import { ResponseAttachmentModule } from '../response-attachment/response-attachment.module';
import { ResponseJSONVariantService } from './response-json-variant.service';
import { ResponsePromptVariantService } from './response-prompt-variant.service';
import { ResponseTextVariantService } from './response-text-variant.service';
import { ResponseVariantLoguxController } from './response-variant.logux.controller';
import { ResponseVariantService } from './response-variant.service';

@Module({
  imports: [
    PromptORM.register(),
    AssistantORM.register(),
    ConditionORM.register(),
    ResponseVariantORM.register(),
    ResponseTextVariantORM.register(),
    ResponseJSONVariantORM.register(),
    ResponsePromptVariantORM.register(),
    ResponseDiscriminatorORM.register(),
    PromptModule,
    ResponseAttachmentModule,
  ],
  exports: [ResponseVariantService, ResponseJSONVariantService, ResponseTextVariantService, ResponsePromptVariantService],
  providers: [EntitySerializer, ResponseVariantService, ResponseJSONVariantService, ResponseTextVariantService, ResponsePromptVariantService],
  controllers: [ResponseVariantLoguxController],
})
export class ResponseVariantModule {}
