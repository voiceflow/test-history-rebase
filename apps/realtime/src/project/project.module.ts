import { forwardRef, Module } from '@nestjs/common';
import { ProjectORM, VersionIntentORM, VersionSlotORM } from '@voiceflow/orm-designer';

// eslint-disable-next-line import/no-cycle
import { AssistantModule } from '@/assistant/assistant.module';
import { CacheModule } from '@/cache/cache.module';
import { DiagramModule } from '@/diagram/diagram.module';
import { VersionModule } from '@/version/version.module';

import { ProjectSerializer } from './project.serializer';
import { ProjectService } from './project.service';
import { LegacyProjectSerializer } from './project-legacy/legacy-project.serializer';
import { ProjectLegacyService } from './project-legacy/project-legacy.service';
import { ProjectPrivateHTTPController } from './project-private.http.controller';
import { ProjectPublicHTTPController } from './project-public.http.controller';

@Module({
  imports: [
    ProjectORM.register(),
    VersionSlotORM.register(),
    VersionIntentORM.register(),
    forwardRef(() => AssistantModule),
    CacheModule,
    VersionModule,
    DiagramModule,
  ],
  exports: [ProjectService, ProjectLegacyService, ProjectSerializer, LegacyProjectSerializer],
  providers: [ProjectService, ProjectSerializer, LegacyProjectSerializer, ProjectLegacyService],
  controllers: [ProjectPublicHTTPController, ProjectPrivateHTTPController],
})
export class ProjectModule {}
