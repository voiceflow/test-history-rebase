import { UserRole } from '@voiceflow/internal';

import { Resource, ResourceOptions } from '../resource';

export class WorkspaceMember extends Resource {
  constructor(options: ResourceOptions) {
    super({ ...options, path: '/workspace-member' });
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
