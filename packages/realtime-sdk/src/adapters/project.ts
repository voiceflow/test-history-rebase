import { AnyProject, DBProject } from '@realtime-sdk/models';
import { Models as BaseModels } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import createAdapter, { AdapterNotImplementedError } from 'bidirectional-adapter';

const projectAdapter = createAdapter<DBProject, AnyProject>(
  ({
    _id,
    teamID,
    name,
    devVersion,
    platform,
    privacy,
    image = null,
    liveVersion,
    linkType = BaseModels.ProjectLinkType.CURVED,
    members,
    platformData,
    reportTags = {},
  }) => ({
    id: _id,
    name,
    isLive: !!liveVersion,
    module: '',
    locales: [],
    created: '',
    platform: platform as Constants.PlatformType,
    diagramID: '',
    versionID: devVersion!,
    workspaceID: teamID,
    image,
    privacy,
    linkType,
    members,
    platformData,
    reportTags,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default projectAdapter;
