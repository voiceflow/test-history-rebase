import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractControl } from '../control';

class VariableStateService extends AbstractControl {
  public async getAll(creatorID: number, projectID: string): Promise<Realtime.DBVariableState[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.variableState.list(projectID);
  }

  public async create(creatorID: number, variableState: Realtime.DBVariableState): Promise<Realtime.DBVariableState> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.variableState.create(variableState);
  }
}

export default VariableStateService;
