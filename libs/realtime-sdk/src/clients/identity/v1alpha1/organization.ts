import type { Identity } from '@/models';

import type { NestResourceOptions } from '../../nest';
import { NestResource } from '../../nest';

export class Organization extends NestResource {
  constructor(options: NestResourceOptions) {
    super({ ...options, path: '/organization' });
  }

  public async list(params?: { members?: boolean; trial?: boolean }): Promise<Identity.Organization[]> {
    const { data } = await this.get<Identity.Organization[]>('/', { params });

    return data;
  }

  public async getWorkspaces(organizationID: string): Promise<Identity.Workspace[]> {
    const { data } = await this.get<Identity.Workspace[]>(`/${organizationID}/workspaces`);

    return data;
  }

  public async update(organizationID: string, payload: { name: string }): Promise<void> {
    await this.patch(`/${organizationID}`, payload);
  }

  public async updateImage(organizationID: string, payload: unknown): Promise<{ image: string }> {
    const { data } = await this.put<{ image: string }>(`/${organizationID}/image`, payload);

    return data;
  }
}
