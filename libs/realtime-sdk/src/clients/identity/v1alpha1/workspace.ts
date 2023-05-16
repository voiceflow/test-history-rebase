import * as Models from '@realtime-sdk/models';
import * as Identity from '@realtime-sdk/models/Identity';
import { DBWorkspaceProperties } from '@realtime-sdk/models/Workspace';

import { NestResource, NestResourceOptions } from '../../nest';

export class Workspace extends NestResource {
  constructor(options: NestResourceOptions) {
    super({ ...options, path: '/workspace' });
  }

  public async findOne(workspaceID: string): Promise<Identity.WorkspaceCombined> {
    const { data } = await this.get<Identity.WorkspaceCombined>(`/${workspaceID}`);

    return data;
  }

  public async create(payload: {
    name: string;
    image?: string | null;
    settings?: DBWorkspaceProperties;
    organizationID?: string;
  }): Promise<Identity.Workspace> {
    const { data } = await this.post('/', payload);

    return data;
  }

  public async update(workspaceID: string, payload: { name: string }): Promise<void> {
    await this.patch(`/${workspaceID}`, payload);
  }

  public async updateImage(workspaceID: string, payload: unknown): Promise<{ image: string }> {
    const { data } = await this.put<{ image: string }>(`/${workspaceID}/image`, payload);

    return data;
  }

  public async remove(workspaceID: string): Promise<void> {
    await this.delete(`/${workspaceID}`);
  }

  public async notifyAdmins(workspaceID: string): Promise<void> {
    await this.post(`/notify-admins-trial-expired/${workspaceID}`);
  }

  public async list(params?: { members?: boolean }): Promise<Identity.WorkspaceCombined[]> {
    const { data } = await this.get<Identity.WorkspaceCombined[]>(`/`, { params });

    return data;
  }

  public async getOrganization(workspaceID: string): Promise<Models.Organization> {
    const { data } = await this.get(`/${workspaceID}/organization`);

    return data;
  }
}
