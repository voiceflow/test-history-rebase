import { Module } from '@nestjs/common';
import { AssistantORM, FlowORM } from '@voiceflow/orm-designer';

import { DiagramModule } from '@/diagram/diagram.module';

import { FlowLoguxController } from './flow.logux.controller';
import { FlowService } from './flow.service';

@Module({
  imports: [FlowORM.register(), AssistantORM.register(), DiagramModule],
  exports: [FlowService],
  providers: [FlowService],
  controllers: [FlowLoguxController],
})
export class FlowModule {}
