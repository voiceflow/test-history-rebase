import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { Atomic, ProjectEntity, ProjectObject, ProjectORM } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { IdentityClient } from '@voiceflow/sdk-identity';

import { MutableService } from '@/common';
import { LegacyProjectSerializer } from '@/project/project-legacy/legacy-project.serializer';

import { ProjectSerializer } from './project.serializer';
import { KnowledgeBaseDocumentRefreshRate } from '@voiceflow/dtos';

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

  async findOneOrFailWithFields<Key extends keyof ProjectObject>(versionID: Primary<ProjectEntity>, fields: [Key, ...Key[]]) {
    return this.orm.findOneOrFail(versionID, { fields });
  }

  findManyByWorkspaceID(workspaceID: number) {
    return this.orm.find({ teamID: workspaceID });
  }

  async findManyLegacyProjectsByWorkspaceID(workspaceID: number) {
    const [projects, members] = await Promise.all([
      this.findManyByWorkspaceID(workspaceID),
      this.identityClient.private.findAllProjectMembersForForWorkspace(this.projectSerializer.encodeWorkspaceID(workspaceID)),
    ]);

    const membersPerProject = members.reduce<Record<string, Realtime.ProjectMember[]>>((acc, member) => {
      acc[member.membership.projectID] ??= [];
      acc[member.membership.projectID]!.push(Realtime.Adapters.Identity.projectMember.fromDB(member as unknown as Realtime.Identity.ProjectMember));
      return acc;
    }, {});

    return projects.map((project) => this.legacyProjectSerializer.serialize(project, membersPerProject[project._id.toJSON()] ?? []));
  }

  async unsetDocumentsAccessToken(assistantID: string, documentIDs: string[]) {
    return this.orm.atomicUpdateOne(assistantID, [
      Atomic.Unset(
        documentIDs.map((id) => ({
          path: `knowledgeBase.documents.${id}.data.accessTokenID`,
        }))
      ),
    ]);
  }

  async updateDocumentsRefreshRate(assistantID: string, documentIDs: string[], refreshRate: KnowledgeBaseDocumentRefreshRate) {
    return this.orm.findOneAndAtomicUpdate(assistantID, [
      Atomic.Set(
        documentIDs.map((id) => ({
          path: `knowledgeBase.documents.${id}.data.refreshRate`,
          value: refreshRate,
        }))
      ),
    ]);
  }
}
