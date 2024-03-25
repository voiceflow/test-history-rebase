import { Module } from '@nestjs/common';
import { DiagramORM } from '@voiceflow/orm-designer';

import { DiagramService } from './diagram.service';
import { DiagramUtil } from './diagram.util';
import { DiagramNodeService } from './diagram-node.service';

@Module({
  imports: [],
  exports: [DiagramService, DiagramNodeService, DiagramUtil],
  providers: [DiagramORM, DiagramService, DiagramNodeService, DiagramUtil],
})
export class DiagramModule {}
