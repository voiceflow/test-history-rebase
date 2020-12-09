import { Version } from '@voiceflow/api-sdk';
import { GeneralVersionData } from '@voiceflow/general-types';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { BUILT_IN_VARIABLES, PlatformType } from '@/constants';
import { FullSkill } from '@/models';

import settingsAdapter from './settings';

const generalVersionAdapter = createAdapter<Version<GeneralVersionData>, FullSkill<string>>(
  ({ name, _id, creatorID, projectID, rootDiagramID, variables, platformData: { settings } }) => ({
    id: _id,
    name,
    creatorID,
    projectID,
    rootDiagramID,
    diagramID: rootDiagramID,
    platform: PlatformType.GENERAL,
    locales: ['en-US'] as any,
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
      ...settingsAdapter.fromDB(settings),
      preview: false,
      fulfillment: {},
      access_token_variable: null,
      alexa_permissions: [],
      alexa_interfaces: null,
      google_versions: null,
      updatesDescription: '',
      summary: '',
      description: '',
      keywords: '',
      locales: [],
      invocations: [],
      category: null,
      purchase: false,
      personal: false,
      copa: false,
      ads: false,
      export: false,
      instructions: '',
      stage: 0,
      invName: '',
      smallIcon: '',
      largeIcon: '',
      alexaEvents: '',
      accountLinking: null,
      privacyPolicy: '',
      termsAndCond: '',
    },
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default generalVersionAdapter;
