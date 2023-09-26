import { Module } from '@nestjs/common';

import { LegacyModule } from '@/legacy/legacy.module';

import { DiagramORM } from './diagram.orm';
import { DiagramService } from './diagram.service';

@Module({
  imports: [LegacyModule],
  providers: [DiagramService, DiagramORM],
  exports: [DiagramService],
})
export class DiagramModule {}
