import { Module } from '@nestjs/common';

import ProjectMemberService from './project-member.service';

@Module({
  providers: [ProjectMemberService],
  exports: [ProjectMemberService],
})
export class ProjectMemberModule {}
