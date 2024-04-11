import { forwardRef, Module } from '@nestjs/common';
import { BackupORM } from '@voiceflow/orm-designer';

// eslint-disable-next-line import/no-cycle
import { AssistantModule } from '@/assistant/assistant.module';
import { EnvironmentModule } from '@/environment/environment.module';
import { ProjectModule } from '@/project/project.module';

import { BackupHTTPController } from './backup.http.controller';
import { BackupService } from './backup.service';

@Module({
  imports: [forwardRef(() => AssistantModule), ProjectModule, EnvironmentModule],
  exports: [BackupService],
  providers: [BackupORM, BackupService],
  controllers: [BackupHTTPController],
})
export class BackupModule {}
