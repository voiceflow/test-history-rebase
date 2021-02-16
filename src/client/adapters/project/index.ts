import { AlexaProjectData, AlexaProjectMemberData } from '@voiceflow/alexa-types';
import { BasePlatformData, Project as DBProject, ProjectLinkType } from '@voiceflow/api-sdk';
import { GoogleProjectData, GoogleProjectMemberData } from '@voiceflow/google-types';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { PlatformType } from '@/constants';
import { Project } from '@/models';

export { default as productAdapter } from './product';

const projectAdapter = createAdapter<
  DBProject<AlexaProjectData | GoogleProjectData | BasePlatformData, AlexaProjectMemberData | GoogleProjectMemberData | BasePlatformData>,
  Project
>(
  ({ _id, name, devVersion, platform, privacy, image = null, liveVersion, linkType = ProjectLinkType.CURVED }) => ({
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
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default projectAdapter;
