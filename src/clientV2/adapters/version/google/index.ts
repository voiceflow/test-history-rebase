import { GoogleVersion } from '@voiceflow/google-types';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { BUILT_IN_VARIABLES, PlatformType } from '@/constants';
import { FullSkill } from '@/models';

import publishingAdapter from './publishing';
import settingsAdapter from './settings';

const alexaVersionAdapter = createAdapter<GoogleVersion, FullSkill>(
  ({ name, _id, creatorID, projectID, rootDiagramID, variables, platformData: { settings, publishing } }) => ({
    id: _id,
    name,
    creatorID,
    projectID,
    rootDiagramID,
    diagramID: rootDiagramID,
    platform: PlatformType.GOOGLE,
    locales: (publishing?.locales || ['en-US']) as any,
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
