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

  // Routes supporting the legacy UI.

  public async listAPIKeys(projectID: string) {
    const { data } = await this.get<Models.Identity.APIKey[]>(`/legacy/project/${projectID}`);

    return data;
  }

  public async createAPIKey({ projectID }: { projectID: string }) {
    const { data } = await this.post<Models.Identity.APIKey>(`/legacy/project/${projectID}`);

    return data;
  }

  public async createSecondaryAPIKey({ projectID, apiKey }: { projectID: string; apiKey: string }) {
    const { data } = await this.post<Models.Identity.APIKey>(`/legacy/project/${projectID}/${apiKey}/secondary`);

    return data;
  }

  public async deleteSecondaryAPIKey({ projectID, apiKey }: { projectID: string; apiKey: string }) {
    const { data } = await this.delete<void>(`/legacy/project/${projectID}/${apiKey}/secondary`);

    return data;
  }

  public async promoteSecondaryAPIKey({ projectID }: { projectID: string }) {
    const { data } = await this.post<Models.Identity.APIKey>(`/legacy/project/${projectID}/secondary/promote`);

    return data;
  }

  public async regenerateAPIKey({ projectID, apiKey }: { projectID: string; apiKey: string }) {
    const { data } = await this.put<Models.Identity.APIKey>(`/legacy/project/${projectID}/${apiKey}`);

    return data;
  }
}
