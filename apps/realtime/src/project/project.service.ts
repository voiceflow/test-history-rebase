import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import type { Project } from '@voiceflow/dtos';
import { ProjectEntity, ProjectObject, ProjectORM } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { IdentityClient } from '@voiceflow/sdk-identity';

import { MutableService } from '@/common';
import { LegacyProjectSerializer } from '@/project/project-legacy/legacy-project.serializer';

import { ProjectSerializer } from './project.serializer';

@Injectable()
export class ProjectService extends MutableService<ProjectORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

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

  async findOneOrFailWithFields<Key extends keyof ProjectObject>(
    versionID: Primary<ProjectEntity>,
    fields: [Key, ...Key[]]
  ) {
    return this.orm.findOneOrFail(versionID, { fields });
  }

  findManyByWorkspaceID(workspaceID: number) {
    return this.orm.find({ teamID: workspaceID });
  }

  async findManyLegacyProjectsByWorkspaceID(workspaceID: number) {
    const [projects, members] = await Promise.all([
      this.findManyByWorkspaceID(workspaceID),
      this.identityClient.private.findAllProjectMembersForForWorkspace(
        this.projectSerializer.encodeWorkspaceID(workspaceID)
      ),
    ]);

    const membersPerProject = members.reduce<Record<string, Realtime.ProjectMember[]>>((acc, member) => {
      acc[member.membership.projectID] ??= [];
      acc[member.membership.projectID]!.push(Realtime.Adapters.Identity.projectMember.fromDB(member));
      return acc;
    }, {});

    return projects.map((project) =>
      this.legacyProjectSerializer.serialize(project, membersPerProject[project._id.toJSON()] ?? [])
    );
  }

  async getUniqueProjectName(workspaceID: number, project: Project) {
    let newProjectName = project.name;
    let i = 0;
    const projects = await this.findManyByWorkspaceID(workspaceID);
    // eslint-disable-next-line no-loop-func
    while (projects.find((w) => w.name === newProjectName)) {
      newProjectName = `${project.name} (${++i})`;
    }
    return newProjectName;
  }
}
