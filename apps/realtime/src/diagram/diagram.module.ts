import { Module } from '@nestjs/common';
import { DiagramORM, ProjectORM } from '@voiceflow/orm-designer';

import { DiagramService } from './diagram.service';
import { DiagramUtil } from './diagram.util';
import { DiagramNodeService } from './diagram-node.service';

@Module({
  imports: [],
  exports: [DiagramService, DiagramNodeService, DiagramUtil],
  providers: [DiagramORM, ProjectORM, DiagramService, DiagramNodeService, DiagramUtil],
})
export class DiagramModule {}
