import * as Models from '@realtime-sdk/models';

import { NestResource, NestResourceOptions } from '../../nest';

export class Provider extends NestResource {
  constructor(options: NestResourceOptions) {
    super({ ...options, path: '/saml2-provider' });
  }

  public async findOneByOrganizationDomain(domain: string): Promise<Models.Identity.SAMLProvider> {
    const { data } = await this.get<Models.Identity.SAMLProvider>(`/${domain}`);

    return data;
  }
}
