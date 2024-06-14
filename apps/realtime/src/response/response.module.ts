import { Module } from '@nestjs/common';
import { RequiredEntityORM, ResponseORM } from '@voiceflow/orm-designer';

import { ResponseLoguxController } from './response.logux.controller';
import { ResponseLoguxService } from './response.logux.service';
import { ResponseRepository } from './response.repository';
import { ResponseService } from './response.service';
import { ResponseAttachmentModule } from './response-attachment/response-attachment.module';
import { ResponseCloneService } from './response-clone.service';
import { ResponseDiscriminatorModule } from './response-discriminator/response-discriminator.module';
import { ResponseDuplicateService } from './response-duplicate.service';
import { ResponseExportService } from './response-export.service';
import { ResponseImportService } from './response-import.service';
import { ResponseMessageModule } from './response-message/response-message.module';
import { ResponseMigrationService } from './response-migration.service';
import { ResponseVariantModule } from './response-variant/response-variant.module';

@Module({
  imports: [ResponseVariantModule, ResponseAttachmentModule, ResponseDiscriminatorModule, ResponseMessageModule],
  exports: [ResponseService, ResponseRepository],
  providers: [
    ResponseORM,
    RequiredEntityORM,
    ResponseService,
    ResponseMigrationService,
    ResponseImportService,
    ResponseExportService,
    ResponseDuplicateService,
    ResponseCloneService,
    ResponseRepository,
    ResponseLoguxService,
  ],
  controllers: [ResponseLoguxController],
})
export class ResponseModule {}
