import type * as Models from '@realtime-sdk/models';

import type { NestResourceOptions } from '../../nest';
import { NestResource } from '../../nest';

export class Provider extends NestResource {
  constructor(options: NestResourceOptions) {
    super({ ...options, path: '/saml2-provider' });
  }

  public async findOneByOrganizationID(organizationID: string): Promise<Models.Identity.SAMLProvider> {
    const { data } = await this.get<Models.Identity.SAMLProvider>(`/${organizationID}`);

    return data;
  }

  public async createOneForOrganization(
    organizationID: string,
    values: Omit<Models.Identity.SAMLProvider, 'id' | 'organizationID' | 'legacyProviderID'>
  ): Promise<Models.Identity.SAMLProvider> {
    const { data } = await this.post<Models.Identity.SAMLProvider>(`/${organizationID}`, values);

    return data;
  }

  public async patchOneForOrganization(
    organizationID: string,
    values: Partial<Omit<Models.Identity.SAMLProvider, 'id' | 'organizationID' | 'legacyProviderID'>>
  ): Promise<void> {
    await this.patch<void>(`/${organizationID}`, values);
  }
}
