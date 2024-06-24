import { Module } from '@nestjs/common';
import { AssistantORM, ResponseDiscriminatorORM, ResponseORM } from '@voiceflow/orm-designer';

import { ResponseMessageModule } from '../response-message/response-message.module';
import { ResponseVariantModule } from '../response-variant/response-variant.module';
import { ResponseDiscriminatorLoguxController } from './response-discriminator.logux.controller';
import { ResponseDiscriminatorService } from './response-discriminator.service';

@Module({
  imports: [ResponseVariantModule, ResponseMessageModule],
  exports: [ResponseDiscriminatorService],
  providers: [ResponseORM, AssistantORM, ResponseDiscriminatorORM, ResponseDiscriminatorService],
  controllers: [ResponseDiscriminatorLoguxController],
})
export class ResponseDiscriminatorModule {}
