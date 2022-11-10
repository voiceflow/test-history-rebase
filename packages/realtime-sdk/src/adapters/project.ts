import { AnyProject } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import { AnyRecord } from '@voiceflow/common';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import { legacyPlatformToProjectType } from '../constants/platform';

const projectAdapter = createMultiAdapter<BaseModels.Project.Model<AnyRecord, AnyRecord>, AnyProject>(
  ({
    _id,
    name,
    type: dbType,
    image = null,
    teamID,
    privacy,
    members,
    linkType = BaseModels.Project.LinkType.CURVED,
    platform: dbPlatform,
    _version,
    reportTags = {},
    devVersion,
    liveVersion,
    apiPrivacy,
    prototype,
    platformData,
    customThemes,
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
      locales: [],
      created: '',
      members,
      privacy,
      linkType,
      platform,
      typeV2: type,
      platformV2: platform,
      _version,
      diagramID: '',
      versionID: devVersion!,
      customThemes,
      liveVersion,
      reportTags,
      prototype,
      apiPrivacy,
      workspaceID: teamID,
      platformData,
    };
  },
  notImplementedAdapter.transformer
);

export default projectAdapter;
