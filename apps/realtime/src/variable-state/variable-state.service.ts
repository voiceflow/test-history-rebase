import { Inject, Injectable } from '@nestjs/common';
import { BaseModels } from '@voiceflow/base-types';

import { VariableStateORM } from '../orm/variable-state.orm';

@Injectable()
export class VariableStateService {
  constructor(@Inject(VariableStateORM) private orm: VariableStateORM) {}

  public async findManyByProjectID(projectID: string): Promise<BaseModels.VariableState.Model[]> {
    return this.orm.findManyByProjectID(projectID);
  }
}
