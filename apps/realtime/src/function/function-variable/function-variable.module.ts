import { Module } from '@nestjs/common';
import { AssistantORM, FunctionORM, FunctionVariableORM } from '@voiceflow/orm-designer';

import { FunctionVariableLoguxController } from './function-variable.logux.controller';
import { FunctionVariableService } from './function-variable.service';

@Module({
  exports: [FunctionVariableService],
  providers: [FunctionORM, AssistantORM, FunctionVariableORM, FunctionVariableService],
  controllers: [FunctionVariableLoguxController],
})
export class FunctionVariableModule {}
