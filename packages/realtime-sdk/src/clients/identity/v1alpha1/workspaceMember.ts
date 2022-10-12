import { Resource, ResourceOptions } from '../resource';

export class WorkspaceMember extends Resource {
  constructor(options: ResourceOptions) {
    super({ ...options, path: '/workspace-member' });
  }

  public async remove(workspaceID: string, userID: number): Promise<void> {
    await this.delete(`/${workspaceID}/${userID}`);
  }

  public async removeSelf(workspaceID: string): Promise<void> {
    await this.delete(`/${workspaceID}/self`);
  }
}
