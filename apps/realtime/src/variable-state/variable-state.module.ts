import { Module } from '@nestjs/common';
import { VariableStateORM } from '@voiceflow/orm-designer';

import { VariableStateService } from './variable-state.service';

@Module({
  exports: [VariableStateService],
  providers: [VariableStateORM, VariableStateService],
})
export class VariableStateModule {}
