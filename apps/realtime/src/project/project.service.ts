import { Inject, Injectable } from '@nestjs/common';
import { ProjectORM } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { IdentityClient } from '@voiceflow/sdk-identity';

import { MutableService } from '@/common';
import { LegacyProjectSerializer } from '@/project/project-legacy/legacy-project.serializer';

import { ProjectSerializer } from './project.serializer';

@Injectable()
export class ProjectService extends MutableService<ProjectORM> {
  constructor(
    @Inject(ProjectORM)
    protected readonly orm: ProjectORM,
    @Inject(IdentityClient)
    private readonly identityClient: IdentityClient,
    @Inject(ProjectSerializer)
    private readonly projectSerializer: ProjectSerializer,
    @Inject(LegacyProjectSerializer)
    private readonly legacyProjectSerializer: LegacyProjectSerializer
  ) {
    super();
  }

  findManyByWorkspaceID(workspaceID: number) {
    return this.orm.find({ teamID: workspaceID });
  }

  public async findManyLegacyProjectsByWorkspaceID(workspaceID: number) {
    const [projects, members] = await Promise.all([
      this.findManyByWorkspaceID(workspaceID),
      this.identityClient.private.findAllProjectMembersForForWorkspace(this.projectSerializer.encodeWorkspaceID(workspaceID)),
    ]);

    const membersPerProject = members.reduce<Record<string, Realtime.ProjectMember[]>>((acc, member) => {
      acc[member.membership.projectID] ??= [];
      acc[member.membership.projectID]!.push(Realtime.Adapters.Identity.projectMember.fromDB(member as unknown as Realtime.Identity.ProjectMember));
      return acc;
    }, {});

    return projects.map((project) => this.legacyProjectSerializer.serialize(project, membersPerProject[project.id] ?? []));
  }
}
