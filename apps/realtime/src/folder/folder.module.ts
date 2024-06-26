import { Module } from '@nestjs/common';
import { FolderORM } from '@voiceflow/orm-designer';

import { DiagramModule } from '@/diagram/diagram.module';
import { EntityModule } from '@/entity/entity.module';
import { FlowModule } from '@/flow/flow.module';
import { FunctionModule } from '@/function/function.module';
import { IntentModule } from '@/intent/intent.module';
import { ReferenceModule } from '@/reference/reference.module';
import { ResponseModule } from '@/response/response.module';
import { VariableModule } from '@/variable/variable.module';
import { WorkflowModule } from '@/workflow/workflow.module';

import { FolderLoguxController } from './folder.logux.controller';
import { FolderService } from './folder.service';

@Module({
  imports: [
    EntityModule,
    IntentModule,
    FunctionModule,
    ResponseModule,
    VariableModule,
    FlowModule,
    WorkflowModule,
    DiagramModule,
    ReferenceModule,
  ],
  exports: [FolderService],
  providers: [FolderORM, FolderService],
  controllers: [FolderLoguxController],
})
export class FolderModule {}
