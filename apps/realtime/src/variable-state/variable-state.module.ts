import { Module } from '@nestjs/common';

import { LegacyModule } from '@/legacy/legacy.module';
import { VariableStateORM } from '@/orm/variable-state.orm';

import { VariableStateService } from './variable-state.service';

@Module({
  imports: [LegacyModule],
  providers: [VariableStateORM, VariableStateService],
  exports: [VariableStateService],
})
export class VariableStateModule {}
