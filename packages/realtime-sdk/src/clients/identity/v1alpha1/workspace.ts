import { IdentityWorkspace } from '@realtime-sdk/models/Workspace';

import { Resource, ResourceOptions } from '../resource';

export class Workspace extends Resource {
  constructor(options: ResourceOptions) {
    super({ ...options, path: '/workspace' });
  }

  public async create(payload: { name: string; organizationID?: string; image?: string | null }): Promise<IdentityWorkspace> {
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

  public async list(): Promise<IdentityWorkspace[]> {
    const { data } = await this.get<IdentityWorkspace[]>(`/`);

    return data;
  }
}
