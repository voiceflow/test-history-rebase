import type * as Models from '@realtime-sdk/models';
import type { Provider } from '@voiceflow/schema-types';

import type { NestResourceOptions } from '../../nest';
import { NestResource } from '../../nest';

export class User extends NestResource {
  constructor(options: NestResourceOptions) {
    super({ ...options, path: '/user' });
  }

  public async getSelf(): Promise<Models.Identity.User> {
    const { data } = await this.get<Models.Identity.User>('/');

    return data;
  }

  public async getSelfProviders(): Promise<Pick<Provider, 'id' | 'type' | 'organizationID'>[]> {
    const { data } = await this.get<Pick<Provider, 'id' | 'type' | 'organizationID'>[]>('/providers');

    return data;
  }

  public async create(payload: {
    user: { name: string; email: string };
    password: string;
    metadata?: {
      utm?: Record<string, unknown>;
      inviteParams?: Record<string, unknown>;
      partnerKey?: string;
    };
  }): Promise<Models.Identity.User> {
    const { data } = await this.post<Models.Identity.User>('/', payload);

    return data;
  }

  public async update(payload: Pick<Models.Identity.User, 'name'>): Promise<void> {
    await this.patch('/', payload);
  }

  public async resendSignupVerificationEmail(payload: {
    metadata?: { inviteParams?: Record<string, unknown>; partnerKey?: string };
  }): Promise<void> {
    await this.post('/verify', payload);
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

  public async updateImage(file: unknown): Promise<{ image: string }> {
    const { data } = await this.put('/image', file);
    return data;
  }

  public async updatePassword(oldPassword: string, nextPassword: string): Promise<void> {
    await this.put('/password', { oldPassword, nextPassword });
  }

  public async resetEmail(email: string): Promise<void> {
    await this.post(`/password/${email}`);
  }

  public async testResetPassword(token: string): Promise<void> {
    await this.head(`/reset/${token}`);
  }

  public async resetPassword(token: string, nextPassword: string): Promise<void> {
    await this.post(`/reset/${token}`, { nextPassword });
  }
}
