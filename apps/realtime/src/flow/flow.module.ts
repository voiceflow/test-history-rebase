import { Module } from '@nestjs/common';
import { FlowORM } from '@voiceflow/orm-designer';

import { FlowLoguxController } from './flow.logux.controller';
import { FlowService } from './flow.service';

@Module({
  imports: [FlowORM.register()],
  exports: [FlowService],
  providers: [FlowService],
  controllers: [FlowLoguxController],
})
export class FlowModule {}
