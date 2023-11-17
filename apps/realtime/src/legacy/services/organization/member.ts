import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractControl } from '../../control';

class OrganizationMemberService extends AbstractControl {
  public async getAll(creatorID: number, organizationID: string): Promise<Realtime.OrganizationMember[]> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    return client.identity.organizationMember.list(organizationID).then(Realtime.Adapters.Identity.organizationMember.mapFromDB);
  }

  public async add(creatorID: number, organizationID: string, memberID: number): Promise<void> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    return client.identity.organizationMember.add(organizationID, memberID);
  }

  public async remove(creatorID: number, organizationID: string, memberID: number): Promise<void> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    return client.identity.organizationMember.remove(organizationID, memberID);
  }

  public async removeSelf(creatorID: number, organizationID: string): Promise<void> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);
    return client.identity.organizationMember.removeSelf(organizationID);
  }
}

export default OrganizationMemberService;
