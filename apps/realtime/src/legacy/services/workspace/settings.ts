import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractControl } from '../../control';

class WorkspaceSettingsService extends AbstractControl {
  public async getAll(creatorID: number, workspaceID: number | string): Promise<Realtime.WorkspaceSettings> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    try {
      const properties = await client.identity.workspaceProperty.findAll(workspaceID);

      return Realtime.Adapters.workspaceSettingsAdapter.fromDB(properties);
    } catch (e) {
      return Realtime.Adapters.workspaceSettingsAdapter.fromDB({});
    }
  }

  public async patch(creatorID: number, workspaceID: number | string, settings: Realtime.WorkspaceSettings): Promise<void> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    const properties = Realtime.Adapters.workspaceSettingsAdapter.toDB(settings);

    client.identity.workspaceProperty.update(workspaceID, properties);
  }
}

export default WorkspaceSettingsService;
