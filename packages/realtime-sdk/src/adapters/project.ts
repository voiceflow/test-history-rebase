import { AnyProject } from '@realtime-sdk/models';
import { AnyRecord, BaseModels } from '@voiceflow/base-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import createAdapter, { AdapterNotImplementedError } from 'bidirectional-adapter';

const projectAdapter = createAdapter<BaseModels.Project.Model<AnyRecord, AnyRecord>, AnyProject>(
  ({
    _id,
    name,
    image = null,
    teamID,
    privacy,
    members,
    linkType = BaseModels.Project.LinkType.CURVED,
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
    platform: platform as VoiceflowConstants.PlatformType,
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
