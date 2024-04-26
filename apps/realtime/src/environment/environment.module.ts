import { forwardRef, Module } from '@nestjs/common';
import { AssistantORM } from '@voiceflow/orm-designer';

import { AttachmentModule } from '@/attachment/attachment.module';
import { DiagramModule } from '@/diagram/diagram.module';
import { EntityModule } from '@/entity/entity.module';
import { EntityVariantModule } from '@/entity/entity-variant/entity-variant.module';
import { FlowModule } from '@/flow/flow.module';
import { FolderModule } from '@/folder/folder.module';
import { FunctionModule } from '@/function/function.module';
import { IntentModule } from '@/intent/intent.module';
import { RequiredEntityModule } from '@/intent/required-entity/required-entity.module';
import { UtteranceModule } from '@/intent/utterance/utterance.module';
import { ProjectModule } from '@/project/project.module';
import { ProjectSerializer } from '@/project/project.serializer';
import { ResponseModule } from '@/response/response.module';
import { ResponseDiscriminatorModule } from '@/response/response-discriminator/response-discriminator.module';
import { ResponseVariantModule } from '@/response/response-variant/response-variant.module';
import { VariableModule } from '@/variable/variable.module';
import { VersionModule } from '@/version/version.module';
import { WorkflowModule } from '@/workflow/workflow.module';

import { EnvironmentLoguxController } from './environment.logux.controller';
import { EnvironmentService } from './environment.service';
import { EnvironmentUtil } from './environment.util';
import { EnvironmentNLUTrainingUtil } from './environment-nlu-training.util';
import { EnvironmentPrivateHTTPController } from './environment-private.http.controller';
import { EnvironmentPublicHTTPController } from './environment-public.http.controller';

@Module({
  imports: [
    FlowModule,
    FolderModule,
    EntityModule,
    IntentModule,
    VersionModule,
    DiagramModule,
    ResponseModule,
    FunctionModule,
    VariableModule,
    WorkflowModule,
    UtteranceModule,
    AttachmentModule,
    EntityVariantModule,
    RequiredEntityModule,
    ResponseVariantModule,
    ResponseDiscriminatorModule,
    forwardRef(() => ProjectModule),
  ],
  exports: [EnvironmentService],
  providers: [AssistantORM, EnvironmentService, ProjectSerializer, EnvironmentUtil, EnvironmentNLUTrainingUtil],
  controllers: [EnvironmentLoguxController, EnvironmentPublicHTTPController, EnvironmentPrivateHTTPController],
})
export class EnvironmentModule {}
