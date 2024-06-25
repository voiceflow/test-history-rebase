import type * as Models from '@realtime-sdk/models';
import type { UserRole } from '@voiceflow/dtos';

import type { NestResourceOptions } from '../../nest';
import { NestResource } from '../../nest';

export class WorkspaceMember extends NestResource {
  constructor(options: NestResourceOptions) {
    super({ ...options, path: '/workspace-member' });
  }

  public async list(workspaceID: string): Promise<Models.Identity.WorkspaceMember[]> {
    const { data } = await this.get<Models.Identity.WorkspaceMember[]>(`/${workspaceID}`);

    return data;
  }

  public async update(workspaceID: string, userID: number, payload: { role: UserRole }): Promise<void> {
    await this.patch(`/${workspaceID}/${userID}`, payload);
  }

  public async remove(workspaceID: string, userID: number): Promise<void> {
    await this.delete(`/${workspaceID}/${userID}`);
  }

  public async removeSelf(workspaceID: string): Promise<void> {
    await this.delete(`/${workspaceID}/self`);
  }
}
