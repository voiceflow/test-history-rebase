import { Module } from '@nestjs/common';
import { AssistantORM, ResponseDiscriminatorORM, ResponseORM } from '@voiceflow/orm-designer';

import { ResponseVariantModule } from '../response-variant/response-variant.module';
import { ResponseDiscriminatorLoguxController } from './response-discriminator.logux.controller';
import { ResponseDiscriminatorService } from './response-discriminator.service';

@Module({
  imports: [ResponseORM.register(), AssistantORM.register(), ResponseDiscriminatorORM.register(), ResponseVariantModule],
  controllers: [ResponseDiscriminatorLoguxController],
  providers: [ResponseDiscriminatorService],
  exports: [ResponseDiscriminatorService],
})
export class ResponseDiscriminatorModule {}
