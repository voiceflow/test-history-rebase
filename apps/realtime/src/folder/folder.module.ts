import { Module } from '@nestjs/common';
import { FolderORM } from '@voiceflow/orm-designer';

import { EntityModule } from '@/entity/entity.module';
import { FlowModule } from '@/flow/flow.module';
import { FunctionModule } from '@/function/function.module';
import { IntentModule } from '@/intent/intent.module';
import { VariableModule } from '@/variable/variable.module';

import { FolderLoguxController } from './folder.logux.controller';
import { FolderService } from './folder.service';

@Module({
  imports: [FolderORM.register(), EntityModule, IntentModule, FunctionModule, VariableModule, FlowModule],
  exports: [FolderService],
  providers: [FolderService],
  controllers: [FolderLoguxController],
})
export class FolderModule {}
