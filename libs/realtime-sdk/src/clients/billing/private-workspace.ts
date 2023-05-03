import { NestResource, NestResourceOptions } from '../nest';

export class PrivateWorkspace extends NestResource {
  constructor(options: NestResourceOptions) {
    super({ ...options, path: '/private/workspace' });
  }

  public async downgradeTrial(workspaceID: string) {
    return this.put(`/${workspaceID}/subscription/downgrade-trial`);
  }
}
