import type * as Models from '@/models';

import type { NestResourceOptions } from '../../nest';
import { NestResource } from '../../nest';

export class OrganizationMember extends NestResource {
  constructor(options: NestResourceOptions) {
    super({ ...options, path: '/organization-member' });
  }

  public async list(organizationID: string): Promise<Models.Identity.OrganizationMember[]> {
    const { data } = await this.get<Models.Identity.OrganizationMember[]>(`/${organizationID}`);

    return data;
  }

  public async add(organizationID: string, userID: number): Promise<void> {
    await this.post(`/${organizationID}`, { userID });
  }

  public async remove(organizationID: string, userID: number): Promise<void> {
    await this.delete(`/${organizationID}/${userID}`);
  }

  public async removeSelf(organizationID: string): Promise<void> {
    await this.delete(`/${organizationID}/self`);
  }
}
