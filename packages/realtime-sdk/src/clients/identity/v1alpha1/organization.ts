import { IdentityOrganization } from '@realtime-sdk/models/Organization';

import { NestResource, NestResourceOptions } from '../../nest';

export class Organization extends NestResource {
  constructor(options: NestResourceOptions) {
    super({ ...options, path: '/organization' });
  }

  public async list(): Promise<IdentityOrganization[]> {
    const { data } = await this.get<IdentityOrganization[]>(`/`);
    return data;
  }
}
