import { Module } from '@nestjs/common';
import { AssistantORM, FlowORM } from '@voiceflow/orm-designer';

import { DiagramModule } from '@/diagram/diagram.module';

import { FlowLoguxController } from './flow.logux.controller';
import { FlowService } from './flow.service';

@Module({
  imports: [DiagramModule],
  exports: [FlowService],
  providers: [AssistantORM, FlowORM, FlowService],
  controllers: [FlowLoguxController],
})
export class FlowModule {}
