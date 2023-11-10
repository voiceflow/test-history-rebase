import { Inject, Injectable } from '@nestjs/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { IdentityClient } from '@voiceflow/sdk-identity';

import { projectMemberAdapter } from './project-member.adapters';
import { WorkspaceProjectMembers } from './project-member.interface';

@Injectable()
class ProjectMemberService {
  constructor(@Inject(IdentityClient) private readonly identityClient: IdentityClient) {}

  public async getAll(projectID: string): Promise<Realtime.ProjectMember[]> {
    return this.identityClient.projectMember.findAll(projectID).then(projectMemberAdapter.mapFromDB);
  }

  public async getAllForWorkspace(workspaceID: string): Promise<WorkspaceProjectMembers> {
    const dbMembers = await this.identityClient.projectMember.findAllForWorkspace(workspaceID);

    return dbMembers.reduce<WorkspaceProjectMembers>((acc, member) => {
      const projectMembers = acc[member.membership.projectID] || [];
      return { ...acc, [member.membership.projectID]: [...projectMembers, projectMemberAdapter.fromDB(member)] };
    }, {});
  }

  public async add(projectID: string, { role, creatorID: memberID }: Realtime.ProjectMember): Promise<void> {
    return this.identityClient.projectMember.addMember(projectID, { role, userID: memberID });
  }

  public async addMany(projectID: string, members: Realtime.ProjectMember[]): Promise<void> {
    return this.identityClient.projectMember.addManyMembers(
      projectID,
      members.map(({ role, creatorID }) => ({ role, userID: creatorID }))
    );
  }

  public async patch(projectID: string, memberID: number, { role }: Pick<Realtime.ProjectMember, 'role'>): Promise<void> {
    // TODO: update method name in identity client. Create member is actually patch member
    return this.identityClient.projectMember.createMember(projectID, memberID, { role });
  }

  public async remove(projectID: string, memberID: number): Promise<void> {
    return this.identityClient.projectMember.deleteMember(projectID, memberID);
  }
}

export default ProjectMemberService;
