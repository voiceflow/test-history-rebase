import { Module } from '@nestjs/common';
import { VariableORM } from '@voiceflow/orm-designer';

import { VariableLoguxController } from './variable.logux.controller';
import { VariableService } from './variable.service';

@Module({
  exports: [VariableService],
  providers: [VariableORM, VariableService],
  controllers: [VariableLoguxController],
})
export class VariableModule {}
