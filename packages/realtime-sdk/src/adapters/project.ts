import { ProjectLinkType } from '@voiceflow/api-sdk';
import { PlatformType } from '@voiceflow/internal';

import { AnyProject, DBProject } from '../models';
import { AdapterNotImplementedError, createAdapter } from './utils';

const projectAdapter = createAdapter<DBProject, AnyProject>(
  ({ _id, name, devVersion, platform, privacy, image = null, liveVersion, linkType = ProjectLinkType.CURVED, members, platformData }) => ({
    id: _id,
    name,
    isLive: !!liveVersion,
    module: '',
    locales: [],
    created: '',
    platform: platform as PlatformType,
    diagramID: '',
    versionID: devVersion!,
    image,
    privacy,
    linkType,
    members,
    platformData,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default projectAdapter;
