import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractControl, ControlOptions } from '../../control';
import AccessCache from '../utils/accessCache';
import OrganizationMemberService from './member';

class OrganizationService extends AbstractControl {
  public member: OrganizationMemberService;

  public access = new AccessCache('organization', this.clients, this.services);

  constructor(options: ControlOptions) {
    super(options);

    this.member = new OrganizationMemberService(options);
  }

  public async getAll(creatorID: number): Promise<Realtime.Identity.Organization[]> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    return client.identity.organization.list({ members: true, trial: true });
  }

  public async updateName(creatorID: number, organizationID: string, name: string): Promise<void> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    await client.identity.organization.update(organizationID, { name });
  }
}

export default OrganizationService;
