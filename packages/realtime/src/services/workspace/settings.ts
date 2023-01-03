import * as Realtime from '@voiceflow/realtime-sdk';
import _ from 'lodash';

import { AbstractControl } from '../../control';

class WorkspaceSettingsService extends AbstractControl {
  public async getAll(workspaceID: number | string, creatorID: number): Promise<Realtime.WorkspaceSettings> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    try {
      const properties = await client.identity.workspaceProperty.findAll(workspaceID);
      return Realtime.Adapters.workspaceSettingsAdapter.fromDB(properties);
    } catch (e) {
      return Realtime.Adapters.workspaceSettingsAdapter.fromDB({});
    }
  }

  public async patch(workspaceID: number | string, creatorID: number, settings: Realtime.WorkspaceSettings): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    const properties = Realtime.Adapters.workspaceSettingsAdapter.toDB(settings);
    client.identity.workspaceProperty.update(workspaceID, properties);
  }
}

export default WorkspaceSettingsService;
