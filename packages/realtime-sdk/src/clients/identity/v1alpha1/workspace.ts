import { Resource, ResourceOptions } from '../resource';

export class Workspace extends Resource {
  constructor(options: ResourceOptions) {
    super({ ...options, path: '/workspace' });
  }

  public async remove(workspaceID: string): Promise<void> {
    await this.delete(`/${workspaceID}`);
  }
}
