import { Module } from '@nestjs/common';
import { DiagramORM } from '@voiceflow/orm-designer';

import { DiagramService } from './diagram.service';
import { DiagramUtil } from './diagram.util';
import { DiagramNodeService } from './diagram-node.service';

@Module({
  imports: [DiagramORM.register()],
  exports: [DiagramService, DiagramNodeService, DiagramUtil],
  providers: [DiagramService, DiagramNodeService, DiagramUtil],
})
export class DiagramModule {}
