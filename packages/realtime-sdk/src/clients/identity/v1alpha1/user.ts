import { Resource, ResourceOptions } from '../resource';

export class User extends Resource {
  constructor(options: ResourceOptions) {
    super({ ...options, path: '/user' });
  }

  public async sendUpdateEmailEmail(data: { password: string; nextEmail: string }): Promise<void> {
    await this.post('/email', data);
  }
}
