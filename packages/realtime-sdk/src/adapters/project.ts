import { AnyProject } from '@realtime-sdk/models';
import { Models as BaseModels } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import createAdapter, { AdapterNotImplementedError } from 'bidirectional-adapter';

const projectAdapter = createAdapter<BaseModels.Project<BaseModels.BasePlatformData, BaseModels.BasePlatformData>, AnyProject>(
  ({
    _id,
    name,
    image = null,
    teamID,
    privacy,
    members,
    linkType = BaseModels.ProjectLinkType.CURVED,
    platform,
    _version,
    reportTags = {},
    devVersion,
    liveVersion,
    prototype,
    platformData,
  }) => ({
    id: _id,
    name,
    image,
    isLive: !!liveVersion,
    module: '',
    locales: [],
    created: '',
    members,
    privacy,
    linkType,
    platform: platform as Constants.PlatformType,
    _version,
    diagramID: '',
    versionID: devVersion!,
    reportTags,
    prototype,
    workspaceID: teamID,
    platformData,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default projectAdapter;
