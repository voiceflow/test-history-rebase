import { Project as AlexaProject } from '@voiceflow/alexa-types';
import { BasePlatformData, Member, Project as DBProject, ProjectLinkType } from '@voiceflow/api-sdk';
import { Constants } from '@voiceflow/general-types';
import { Project as GoogleProject } from '@voiceflow/google-types';
import { Adapters } from '@voiceflow/realtime-sdk';

import { Project } from '@/models';

export { default as productAdapter } from './product';

export type AnyProjectData = AlexaProject.AlexaProjectData | GoogleProject.GooglePlatformData | BasePlatformData;
export type AnyProjectMemberData = AlexaProject.AlexaProjectMemberData | GoogleProject.GoogleProjectMemberData | BasePlatformData;

const projectAdapter = Adapters.createAdapter<DBProject<AnyProjectData, AnyProjectMemberData>, Project<AnyProjectData, Member<AnyProjectMemberData>>>(
  ({ _id, name, devVersion, platform, privacy, image = null, liveVersion, linkType = ProjectLinkType.CURVED, members, platformData }) => ({
    id: _id,
    name,
    isLive: !!liveVersion,
    module: '',
    locales: [],
    created: '',
    platform: platform as Constants.PlatformType,
    diagramID: '',
    versionID: devVersion!,
    image,
    privacy,
    linkType,
    members,
    platformData,
  }),
  () => {
    throw new Adapters.AdapterNotImplementedError();
  }
);

export default projectAdapter;
