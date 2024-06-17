import { Module } from '@nestjs/common';
import { AssistantORM, FlowORM } from '@voiceflow/orm-designer';

import { DiagramModule } from '@/diagram/diagram.module';
import { ReferenceModule } from '@/reference/reference.module';

import { FlowLoguxController } from './flow.logux.controller';
import { FlowService } from './flow.service';

@Module({
  imports: [DiagramModule, ReferenceModule],
  exports: [FlowService],
  providers: [AssistantORM, FlowORM, FlowService],
  controllers: [FlowLoguxController],
})
export class FlowModule {}
