import { forwardRef, Module } from '@nestjs/common';

import { WorkspaceModule } from '../workspace.module';
import { WorkspaceMemberLoguxController } from './member.logux.controller';
import { WorkspaceMemberService } from './member.service';

@Module({
  imports: [forwardRef(() => WorkspaceModule)],
  providers: [WorkspaceMemberService],
  exports: [WorkspaceMemberService],
  controllers: [WorkspaceMemberLoguxController],
})
export class WorkspaceMemberModule {}
