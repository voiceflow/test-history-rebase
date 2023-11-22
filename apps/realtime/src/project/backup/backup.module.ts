import { Module } from '@nestjs/common';
import { BackupORM } from '@voiceflow/orm-designer';

import { AssistantModule } from '@/assistant/assistant.module';
import { ProjectModule } from '@/project/project.module';
import { VariableStateModule } from '@/variable-state/variable-state.module';
import { VersionModule } from '@/version/version.module';

import { BackupHTTPController } from './backup.http.controller';
import { BackupService } from './backup.service';

@Module({
  imports: [BackupORM.register(), ProjectModule, VersionModule, VariableStateModule, AssistantModule],
  exports: [BackupService],
  providers: [BackupService],
  controllers: [BackupHTTPController],
})
export class BackupModule {}
