import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractControl } from '../../control';

type WorkspaceProjectMembers = Partial<Record<string, Realtime.ProjectMember[]>>;

class ProjectMemberService extends AbstractControl {
  public async getAll(creatorID: number, projectID: string): Promise<Realtime.ProjectMember[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.identity.projectMember.list(projectID).then(Realtime.Adapters.Identity.projectMember.mapFromDB);
  }

  public async getAllForWorkspace(creatorID: number, workspaceID: string): Promise<WorkspaceProjectMembers> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    const dbMembers = await client.identity.projectMember.listForWorkspace(workspaceID);

    return dbMembers.reduce<WorkspaceProjectMembers>((acc, member) => {
      acc[member.membership.projectID] ??= [];
      acc[member.membership.projectID]!.push(Realtime.Adapters.Identity.projectMember.fromDB(member));

      return acc;
    }, {});
  }

  public async add(creatorID: number, projectID: string, { role, creatorID: memberID }: Realtime.ProjectMember): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.identity.projectMember.create(projectID, { role, userID: memberID });
  }

  public async addMany(creatorID: number, projectID: string, members: Realtime.ProjectMember[]): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.identity.projectMember.createMany(
      projectID,
      members.map(({ role, creatorID }) => ({ role, userID: creatorID }))
    );
  }

  public async patch(creatorID: number, projectID: string, memberID: number, { role }: Pick<Realtime.ProjectMember, 'role'>): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.identity.projectMember.update(projectID, memberID, { role });
  }

  public async remove(creatorID: number, projectID: string, memberID: number): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.identity.projectMember.remove(projectID, memberID);
  }
}

export default ProjectMemberService;
