import { AlexaProjectData, AlexaProjectMemberData } from '@voiceflow/alexa-types';
import { Project as DBProject } from '@voiceflow/api-sdk';
import { GoogleProjectData, GoogleProjectMemberData } from '@voiceflow/google-types';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { PlatformType } from '@/constants';
import { Project } from '@/models';

export { default as productAdapter } from './product';

const projectAdapter = createAdapter<DBProject<AlexaProjectData | GoogleProjectData, AlexaProjectMemberData | GoogleProjectMemberData>, Project>(
  ({ _id, name, devVersion, created, platform, privacy }) => ({
    id: _id,
    name,
    isLive: false,
    module: '',
    locales: [],
    created: created ? new Date(created).toString() : '', // TODO: remove when created will be sent for the template projects
    platform: platform as PlatformType,
    diagramID: '',
    reference: false,
    versionID: devVersion!,
    smallIcon: null,
    largeIcon: null,
    privacy,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default projectAdapter;
