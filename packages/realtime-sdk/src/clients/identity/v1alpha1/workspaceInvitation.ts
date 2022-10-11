import { UserRole } from '@voiceflow/internal';

import { Resource, ResourceOptions } from '../resource';

export class WorkspaceInvitation extends Resource {
  constructor(options: ResourceOptions) {
    super({ ...options, path: '/workspace-invitation' });
  }

  public async getInviteLink(workspaceID: string, userRole?: UserRole): Promise<{ url: string }> {
    const { data } = await this.get<{ url: string }>(`/${workspaceID}`, { params: { role: userRole } });

    return data;
  }
}
