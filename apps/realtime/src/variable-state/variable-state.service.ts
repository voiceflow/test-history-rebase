import { Inject, Injectable } from '@nestjs/common';
import { VariableStateORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';

@Injectable()
export class VariableStateService extends MutableService<VariableStateORM> {
  constructor(
    @Inject(VariableStateORM)
    protected readonly orm: VariableStateORM
  ) {
    super();
  }

  findManyByProject(projectID: string) {
    return this.orm.findManyByProject(projectID);
  }
}
