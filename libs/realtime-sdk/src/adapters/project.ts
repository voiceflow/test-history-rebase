import { AnyProject, ProjectMember } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import { AnyRecord } from '@voiceflow/common';
import { createSimpleAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import * as Normal from 'normal-store';

import { legacyPlatformToProjectType } from '../constants/platform';

const projectSimpleAdapter = createSimpleAdapter<BaseModels.Project.Model<AnyRecord, AnyRecord>, AnyProject, [{ members: ProjectMember[] }]>(
  (
    {
      _id,
      name,
      type: dbType,
      image = null,
      teamID,
      privacy,
      members: platformMembers = [],
      linkType = BaseModels.Project.LinkType.CURVED,
      platform: dbPlatform,
      _version,
      updatedAt,
      updatedBy,
      prototype,
      apiPrivacy,
      reportTags = {},
      devVersion,
      liveVersion,
      platformData,
      customThemes,
      aiAssistSettings = {},
    },
    { members }
  ) => {
    const { nlu, type, platform } = legacyPlatformToProjectType(dbPlatform, dbType);

    return {
      id: _id,
      nlu,
      name,
      type,
      image,
      isLive: !!liveVersion,
      module: '',
      typeV2: type,
      locales: [],
      created: '',
      members: Normal.normalize(members, (member) => String(member.creatorID)),
      privacy,
      linkType,
      platform,
      _version,
      updatedAt,
      updatedBy,
      prototype,
      diagramID: '',
      versionID: devVersion!,
      apiPrivacy,
      reportTags,
      platformV2: platform,
      liveVersion,
      workspaceID: teamID,
      customThemes,
      platformData,
      platformMembers: Normal.normalize(platformMembers, (member) => String(member.creatorID)),
      aiAssistSettings: {
        ...aiAssistSettings,
        /** @deprecated remove after migration from generateStep setting */
        aiPlayground: aiAssistSettings.aiPlayground ?? (aiAssistSettings.generateStep || aiAssistSettings.generateNoMatch) ?? false,
      },
    };
  },
  notImplementedAdapter.transformer
);

const projectAdapter = {
  ...projectSimpleAdapter,

  mapToDB: notImplementedAdapter.multi.mapToDB,

  mapFromDB: (
    projects: BaseModels.Project.Model<AnyRecord, AnyRecord>[],
    { membersPerProject }: { membersPerProject: Partial<Record<string, ProjectMember[]>> }
  ) => projects.map((project) => projectSimpleAdapter.fromDB(project, { members: membersPerProject[project._id] ?? [] })),
};

export default projectAdapter;
