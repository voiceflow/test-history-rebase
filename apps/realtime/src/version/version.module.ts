import { Module } from '@nestjs/common';

import { DiagramModule } from '@/diagram/diagram.module';
import { LegacyModule } from '@/legacy/legacy.module';

import { VersionORM } from '../orm/version.orm';
import { VersionService } from './version.service';

@Module({
  imports: [LegacyModule, DiagramModule],
  providers: [VersionORM, VersionService],
  exports: [VersionService],
})
export class VersionModule {}
