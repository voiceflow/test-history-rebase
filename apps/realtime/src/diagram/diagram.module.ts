import { Module } from '@nestjs/common';
import { DiagramORM } from '@voiceflow/orm-designer';

import { DiagramService } from './diagram.service';
import { DiagramNodeService } from './diagram-node.service';

@Module({
  imports: [DiagramORM.register()],
  exports: [DiagramService, DiagramNodeService],
  providers: [DiagramService, DiagramNodeService],
})
export class DiagramModule {}
