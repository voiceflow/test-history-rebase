import * as Models from '@realtime-sdk/models';

import { Resource, ResourceOptions } from '../resource';

export class User extends Resource {
  constructor(options: ResourceOptions) {
    super({ ...options, path: '/user' });
  }

  public async create(payload: {
    user: { name: string; email: string };
    password: string;
    metadata?: {
      utm?: Record<string, unknown>;
      promoCode?: string | undefined;
      inviteParams?: Record<string, unknown>;
    };
  }): Promise<Models.User> {
    const { data } = await this.post<Models.User>('/', payload);

    return data;
  }

  public async verifySignupEmailToken(token: string): Promise<void> {
    await this.put(`/verify/${token}`);
  }

  public async sendUpdateEmailEmail(payload: { password: string; nextEmail: string }): Promise<void> {
    await this.post('/email', payload);
  }

  public async verifyUpdateEmailToken(token: string): Promise<void> {
    await this.put(`/email/${token}`);
  }
}
