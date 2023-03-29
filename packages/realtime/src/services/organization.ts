/* eslint-disable no-return-await */
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractControl } from '../control';
import AccessCache from './utils/accessCache';

class OrganizationService extends AbstractControl {
  public access = new AccessCache('organization', this.clients, this.services);

  public async getAll(creatorID: number): Promise<Realtime.Identity.Organization[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return await client.identity.organization.list({ members: true });
  }

  public async updateName(creatorID: number, organizationID: string, name: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.identity.organization.update(organizationID, { name });
  }
}

export default OrganizationService;
