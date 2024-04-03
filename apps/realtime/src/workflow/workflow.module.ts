import { Module } from '@nestjs/common';
import { AssistantORM, WorkflowORM } from '@voiceflow/orm-designer';

import { DiagramModule } from '@/diagram/diagram.module';

import { WorkflowLoguxController } from './workflow.logux.controller';
import { WorkflowService } from './workflow.service';

@Module({
  imports: [DiagramModule],
  exports: [WorkflowService],
  providers: [AssistantORM, WorkflowORM, WorkflowService],
  controllers: [WorkflowLoguxController],
})
export class WorkflowModule {}
