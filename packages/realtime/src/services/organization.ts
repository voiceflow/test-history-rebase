/* eslint-disable no-return-await */
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractControl } from '../control';

class OrganizationService extends AbstractControl {
  public async getAll(creatorID: number): Promise<Realtime.Identity.Organization[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return await client.identity.organization.list({ members: true });
  }
}

export default OrganizationService;
