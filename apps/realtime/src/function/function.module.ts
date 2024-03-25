import { Module } from '@nestjs/common';
import { FunctionORM, VersionORM } from '@voiceflow/orm-designer';

import { FunctionLoguxController } from './function.logux.controller';
import { FunctionService } from './function.service';
import { FunctionPathModule } from './function-path/function-path.module';
import { FunctionPublicHTTPController } from './function-public.http.controller';
import { FunctionVariableModule } from './function-variable/function-variable.module';

@Module({
  imports: [FunctionPathModule, FunctionVariableModule],
  exports: [FunctionService],
  providers: [FunctionORM, VersionORM, FunctionService],
  controllers: [FunctionPublicHTTPController, FunctionLoguxController],
})
export class FunctionModule {}
