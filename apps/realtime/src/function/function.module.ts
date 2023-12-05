import { Module } from '@nestjs/common';
import { FunctionORM, VersionORM } from '@voiceflow/orm-designer';

import { FunctionLoguxController } from './function.logux.controller';
import { FunctionService } from './function.service';
import { FunctionPathModule } from './function-path/function-path.module';
import { FunctionPublicHTTPController } from './function-public.http.controller';
import { FunctionVariableModule } from './function-variable/function-variable.module';

@Module({
  imports: [FunctionORM.register(), VersionORM.register(), FunctionPathModule, FunctionVariableModule],
  controllers: [FunctionPublicHTTPController, FunctionLoguxController],
  providers: [FunctionService],
  exports: [FunctionService],
})
export class FunctionModule {}
