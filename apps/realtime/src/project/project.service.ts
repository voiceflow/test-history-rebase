import { Inject, Injectable } from '@nestjs/common';
import { ProjectORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';

@Injectable()
export class ProjectService extends MutableService<ProjectORM> {
  constructor(
    @Inject(ProjectORM)
    protected readonly orm: ProjectORM
  ) {
    super();
  }
}
