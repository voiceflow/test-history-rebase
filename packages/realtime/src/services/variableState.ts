import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractControl } from '../control';

class VariableStateService extends AbstractControl {
  public async getAll(creatorID: number, projectID: string): Promise<Realtime.DBVariableState[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.variableState.list(projectID);
  }

  public async create(creatorID: number, variableState: Realtime.VariableStateData): Promise<Realtime.DBVariableState> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.variableState.create(variableState);
  }

  public async delete(creatorID: number, variableStateID: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.variableState.delete(variableStateID);
  }

  public async patch(
    creatorID: number,
    variableStateID: string,
    variableState: Partial<Realtime.DBVariableState>
  ): Promise<Realtime.DBVariableState> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.variableState.patch(variableStateID, variableState);
  }
}

export default VariableStateService;
