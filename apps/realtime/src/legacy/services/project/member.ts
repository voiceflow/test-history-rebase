import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractControl } from '../../control';

class ProjectMemberService extends AbstractControl {
  public async getAll(creatorID: number, projectID: string): Promise<Realtime.ProjectMember[]> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    return client.identity.projectMember.list(projectID).then(Realtime.Adapters.Identity.projectMember.mapFromDB);
  }

  public async add(creatorID: number, projectID: string, { role, creatorID: memberID }: Realtime.ProjectMember): Promise<void> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    await client.identity.projectMember.create(projectID, { role, userID: memberID });
  }

  public async addMany(creatorID: number, projectID: string, members: Realtime.ProjectMember[]): Promise<void> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    await client.identity.projectMember.createMany(
      projectID,
      members.map(({ role, creatorID }) => ({ role, userID: creatorID }))
    );
  }

  public async patch(creatorID: number, projectID: string, memberID: number, { role }: Pick<Realtime.ProjectMember, 'role'>): Promise<void> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    await client.identity.projectMember.update(projectID, memberID, { role });
  }

  public async remove(creatorID: number, projectID: string, memberID: number): Promise<void> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    await client.identity.projectMember.remove(projectID, memberID);
  }
}

export default ProjectMemberService;
