import { Module } from '@nestjs/common';
import { VariableStateORM } from '@voiceflow/orm-designer';

import { VariableStateService } from './variable-state.service';

@Module({
  imports: [VariableStateORM.register()],
  exports: [VariableStateService],
  providers: [VariableStateService],
})
export class VariableStateModule {}
