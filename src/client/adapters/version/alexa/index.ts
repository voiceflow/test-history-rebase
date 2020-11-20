import { AlexaVersion, Locale } from '@voiceflow/alexa-types';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { BUILT_IN_VARIABLES, PlatformType } from '@/constants';
import { FullSkill } from '@/models';

import publishingAdapter from './publishing';
import settingsAdapter from './settings';

const alexaVersionAdapter = createAdapter<AlexaVersion, FullSkill<Locale>>(
  ({ name, _id, creatorID, projectID, rootDiagramID, variables, platformData: { settings, publishing } }) => ({
    id: _id,
    name,
    creatorID,
    projectID,
    rootDiagramID,
    diagramID: rootDiagramID,
    platform: PlatformType.ALEXA,
    locales: publishing?.locales || [Locale.EN_US],
    globalVariables: variables.filter((variable) => !BUILT_IN_VARIABLES.includes(variable)),
    publishInfo: {
      [PlatformType.ALEXA]: {
        amznID: null,
        vendorId: null,
        review: false,
        live: false,
      },
      [PlatformType.GOOGLE]: {
        googleId: null,
      },
      [PlatformType.GENERAL]: {},
    },
    meta: {
      ...publishingAdapter.fromDB(publishing),
      ...settingsAdapter.fromDB(settings),
      preview: false,
      fulfillment: {},
      access_token_variable: null,
      alexa_permissions: [],
      alexa_interfaces: null,
      google_versions: null,
      updatesDescription: '',
    },
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default alexaVersionAdapter;
