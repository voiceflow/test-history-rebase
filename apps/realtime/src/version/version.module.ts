import { Module } from '@nestjs/common';
import { VersionORM } from '@voiceflow/orm-designer';

import { DiagramModule } from '@/diagram/diagram.module';

import { VersionLoguxController } from './version.logux.controller';
import { VersionService } from './version.service';

@Module({
  imports: [VersionORM.register(), DiagramModule],
  exports: [VersionService],
  providers: [VersionService],
  controllers: [VersionLoguxController],
})
export class VersionModule {}
