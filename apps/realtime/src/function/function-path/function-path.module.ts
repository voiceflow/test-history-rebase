import { Module } from '@nestjs/common';
import { AssistantORM, FunctionORM, FunctionPathORM } from '@voiceflow/orm-designer';

import { FunctionPathLoguxController } from './function-path.logux.controller';
import { FunctionPathService } from './function-path.service';

@Module({
  imports: [FunctionORM.register(), AssistantORM.register(), FunctionPathORM.register()],
  controllers: [FunctionPathLoguxController],
  providers: [FunctionPathService],
  exports: [FunctionPathService],
})
export class FunctionPathModule {}
