import { Module } from '@nestjs/common';
import { AssistantORM, FunctionORM, FunctionVariableORM } from '@voiceflow/orm-designer';

import { FunctionVariableLoguxController } from './function-variable.logux.controller';
import { FunctionVariableService } from './function-variable.service';

@Module({
  imports: [FunctionORM.register(), AssistantORM.register(), FunctionVariableORM.register()],
  controllers: [FunctionVariableLoguxController],
  providers: [FunctionVariableService],
  exports: [FunctionVariableService],
})
export class FunctionVariableModule {}
