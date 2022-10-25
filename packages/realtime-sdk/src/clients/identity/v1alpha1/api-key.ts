import * as Models from '@realtime-sdk/models';

import { NestResource, NestResourceOptions } from '../../nest';

export class ApiKey extends NestResource {
  constructor(options: NestResourceOptions) {
    super({ ...options, path: '/api-key' });
  }

  public async listWorkspaceApiKeys(workspaceID: string): Promise<Models.Identity.APIKey[]> {
    const { data } = await this.get<Models.Identity.APIKey[]>(`/workspace/${workspaceID}`);

    return data;
  }
}
