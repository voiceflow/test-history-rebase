import { Module } from '@nestjs/common';
import { VersionORM } from '@voiceflow/orm-designer';

import { DiagramModule } from '@/diagram/diagram.module';

import { VersionService } from './version.service';

@Module({
  imports: [VersionORM.register(), DiagramModule],
  providers: [VersionService],
  exports: [VersionService],
})
export class VersionModule {}
