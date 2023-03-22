import { Identity } from '@realtime-sdk/models';

import { NestResource, NestResourceOptions } from '../../nest';

export class Organization extends NestResource {
  constructor(options: NestResourceOptions) {
    super({ ...options, path: '/organization' });
  }

  public async list(params?: { members?: boolean }): Promise<Identity.Organization[]> {
    const { data } = await this.get<Identity.Organization[]>('/', { params });

    return data;
  }

  public async getWorkspaces(organizationID: string): Promise<Identity.Workspace[]> {
    const { data } = await this.get<Identity.Workspace[]>(`/${organizationID}/workspaces`);

    return data;
  }
}
