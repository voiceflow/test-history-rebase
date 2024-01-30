import { Module } from '@nestjs/common';
import { VariableORM } from '@voiceflow/orm-designer';

import { VariableLoguxController } from './variable.logux.controller';
import { VariableService } from './variable.service';

@Module({
  imports: [VariableORM.register()],
  exports: [VariableService],
  providers: [VariableService],
  controllers: [VariableLoguxController],
})
export class VariableModule {}
