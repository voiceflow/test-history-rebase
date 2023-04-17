import { NestVersion, NestVersionOptions } from '../../nest';

export class V1Alpha1 extends NestVersion {
  constructor(options: NestVersionOptions) {
    super({ ...options, version: 'v1alpha1' });
  }

  public async revoke(): Promise<void> {
    await this.axios.post('/revoke', { token: this.token ?? '', token_type_hint: 'access_token' });
  }

  public async authenticate(payload: { email: string; password: string }): Promise<{ token: string }> {
    const { data } = await this.axios.post<{ access_token: string }>('/authenticate', { ...payload, grant_type: 'password' });

    return { token: data.access_token };
  }
}
