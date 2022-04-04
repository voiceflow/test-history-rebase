import { AnyProject } from '@realtime-sdk/models';
import { AnyRecord, BaseModels } from '@voiceflow/base-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import createAdapter, { AdapterNotImplementedError } from 'bidirectional-adapter';

import { legacyPlatformToProjectType } from '../constants/platform';

const projectAdapter = createAdapter<BaseModels.Project.Model<AnyRecord, AnyRecord>, AnyProject>(
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
    prototype,
    platformData,
  }) => {
    const { platform, type } = legacyPlatformToProjectType(dbPlatform as VoiceflowConstants.PlatformType, dbType as VoiceflowConstants.ProjectType);

    return {
      id: _id,
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
      reportTags,
      prototype,
      workspaceID: teamID,
      platformData,
    };
  },
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default projectAdapter;
