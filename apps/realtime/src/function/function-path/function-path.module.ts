import { Module } from '@nestjs/common';
import { AssistantORM, FunctionORM, FunctionPathORM } from '@voiceflow/orm-designer';

import { FunctionPathLoguxController } from './function-path.logux.controller';
import { FunctionPathService } from './function-path.service';

@Module({
  exports: [FunctionPathService],
  providers: [FunctionORM, AssistantORM, FunctionPathORM, FunctionPathService],
  controllers: [FunctionPathLoguxController],
})
export class FunctionPathModule {}
