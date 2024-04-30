import type { DBWorkspaceProperties } from '@/models/Workspace';

import type { NestResourceOptions } from '../../nest';
import { NestResource } from '../../nest';

export class WorkspaceProperty extends NestResource {
  constructor(options: NestResourceOptions) {
    super({ ...options, path: '/workspace-property' });
  }

  public async findAll(workspaceID: number | string): Promise<DBWorkspaceProperties> {
    const { data } = await this.get<DBWorkspaceProperties>(`/${workspaceID}`);
    return data;
  }

  public async update(workspaceID: number | string, settings: Partial<DBWorkspaceProperties>): Promise<void> {
    await this.post(`/${workspaceID}`, settings);
  }
}
