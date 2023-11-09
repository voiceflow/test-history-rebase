import { Module } from '@nestjs/common';
import { AssistantORM, FolderORM, FunctionORM } from '@voiceflow/orm-designer';

import { FunctionLoguxController } from './function.logux.controller';
import { FunctionService } from './function.service';
import { FunctionPathModule } from './function-path/function-path.module';
import { FunctionVariableModule } from './function-variable/function-variable.module';

@Module({
  imports: [FolderORM.register(), FunctionORM.register(), AssistantORM.register(), FunctionPathModule, FunctionVariableModule],
  controllers: [FunctionLoguxController],
  providers: [FunctionService],
  exports: [FunctionService],
})
export class FunctionModule {}
