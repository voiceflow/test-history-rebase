import { Module } from '@nestjs/common';
import { RequiredEntityORM, ResponseORM } from '@voiceflow/orm-designer';

import { ResponseLoguxController } from './response.logux.controller';
import { ResponseService } from './response.service';
import { ResponseAttachmentModule } from './response-attachment/response-attachment.module';
import { ResponseDiscriminatorModule } from './response-discriminator/response-discriminator.module';
import { ResponseVariantModule } from './response-variant/response-variant.module';

@Module({
  imports: [ResponseORM.register(), RequiredEntityORM.register(), ResponseVariantModule, ResponseAttachmentModule, ResponseDiscriminatorModule],
  exports: [ResponseService],
  providers: [ResponseService],
  controllers: [ResponseLoguxController],
})
export class ResponseModule {}
