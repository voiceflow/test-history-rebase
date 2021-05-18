import { AlexaProjectData, AlexaProjectMemberData } from '@voiceflow/alexa-types';
import { BasePlatformData, Member, Project as DBProject, ProjectLinkType } from '@voiceflow/api-sdk';
import { GoogleProjectData, GoogleProjectMemberData } from '@voiceflow/google-types';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { PlatformType } from '@/constants';
import { Project } from '@/models';

export { default as productAdapter } from './product';

type AnyPlatformData = AlexaProjectData | GoogleProjectData | BasePlatformData;
type AnyMemberData = AlexaProjectMemberData | GoogleProjectMemberData | BasePlatformData;

const projectAdapter = createAdapter<DBProject<AnyPlatformData, AnyMemberData>, Project<AnyPlatformData, Member<AnyMemberData>>>(
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
