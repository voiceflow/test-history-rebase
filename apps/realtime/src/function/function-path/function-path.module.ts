import { forwardRef,Module } from '@nestjs/common';
import { AssistantORM, FunctionORM, FunctionPathORM } from '@voiceflow/orm-designer';

import { FunctionModule } from '../function.module';
import { FunctionPathLoguxController } from './function-path.logux.controller';
import { FunctionPathService } from './function-path.service';

@Module({
  imports: [
    forwardRef(() => FunctionModule),
  ],
  exports: [FunctionPathService],
  providers: [FunctionORM, AssistantORM, FunctionPathORM, FunctionPathService],
  controllers: [FunctionPathLoguxController],
})
export class FunctionPathModule {}
