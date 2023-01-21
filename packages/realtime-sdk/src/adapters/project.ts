import { AnyProject } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import { AnyRecord } from '@voiceflow/common';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import * as Normal from 'normal-store';

import { legacyPlatformToProjectType } from '../constants/platform';

const projectAdapter = createMultiAdapter<BaseModels.Project.Model<AnyRecord, AnyRecord>, AnyProject>(
  ({
    _id,
    name,
    type: dbType,
    image = null,
    teamID,
    privacy,
    members = [],
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
    aiAssistSettings = { generativeTasks: true },
  }) => {
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
      platformMembers: Normal.normalize(members, (member) => String(member.creatorID)),
      aiAssistSettings,
    };
  },
  notImplementedAdapter.transformer
);

export default projectAdapter;
