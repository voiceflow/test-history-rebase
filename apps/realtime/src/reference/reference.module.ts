import { Module } from '@nestjs/common';
import { ReferenceORM, ReferenceResourceORM } from '@voiceflow/orm-designer';

import { ReferenceService } from './reference.service';

@Module({
  exports: [ReferenceService],
  providers: [ReferenceORM, ReferenceResourceORM, ReferenceService],
  controllers: [],
})
export class BackupModule {}
