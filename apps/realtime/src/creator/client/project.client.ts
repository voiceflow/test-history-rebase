import * as Voiceflow from '@voiceflow/api-sdk';
import { AnyRecord } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

export class ProjectClient {
  constructor(private readonly client: Voiceflow.Client) {}

  public async get(projectID: string) {
    return this.client.project.get(projectID);
  }

  public async patchPlatformData(projectID: string, data: Partial<AnyRecord>) {
    return this.client.project.updatePlatformData(projectID, data);
  }

  public async patch(projectID: string, { _id, ...data }: Partial<Realtime.DBProject>) {
    return this.client.project.update(projectID, data);
  }
}
