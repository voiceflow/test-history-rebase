/* eslint-disable no-return-await */
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractControl } from '../control';

class OrganizationService extends AbstractControl {
  public async getAll(creatorID: number): Promise<Realtime.IdentityOrganization[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    return await client.identity.organization.list();
  }
}

export default OrganizationService;
