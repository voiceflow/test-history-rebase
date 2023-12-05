import { forwardRef, Module } from '@nestjs/common';
import { BackupORM } from '@voiceflow/orm-designer';

// eslint-disable-next-line import/no-cycle
import { AssistantModule } from '@/assistant/assistant.module';
import { EnvironmentModule } from '@/environment/environment.module';
import { ProjectModule } from '@/project/project.module';
import { VersionModule } from '@/version/version.module';

import { BackupHTTPController } from './backup.http.controller';
import { BackupService } from './backup.service';

@Module({
  imports: [BackupORM.register(), forwardRef(() => AssistantModule), ProjectModule, VersionModule, EnvironmentModule],
  exports: [BackupService],
  providers: [BackupService],
  controllers: [BackupHTTPController],
})
export class BackupModule {}
