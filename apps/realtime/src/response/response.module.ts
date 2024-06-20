import { Module } from '@nestjs/common';
import { RequiredEntityORM, ResponseORM } from '@voiceflow/orm-designer';

import { ReferenceModule } from '@/reference/reference.module';

import { ResponseLoguxController } from './response.logux.controller';
import { ResponseService } from './response.service';
import { ResponseAttachmentModule } from './response-attachment/response-attachment.module';
import { ResponseDiscriminatorModule } from './response-discriminator/response-discriminator.module';
import { ResponseVariantModule } from './response-variant/response-variant.module';

@Module({
  imports: [ResponseVariantModule, ResponseAttachmentModule, ResponseDiscriminatorModule, ReferenceModule],
  exports: [ResponseService],
  providers: [ResponseORM, RequiredEntityORM, ResponseService],
  controllers: [ResponseLoguxController],
})
export class ResponseModule {}
