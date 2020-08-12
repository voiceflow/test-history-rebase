import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { BUILT_IN_VARIABLES, PlatformType } from '@/constants';
import { FullSkill } from '@/models';
import { AlexaVersion } from '@/modelsV2';

const alexaVersionAdapter = createAdapter<AlexaVersion, FullSkill>(
  ({
    name,
    _id,
    creatorID,
    projectID,
    rootDiagramID,
    variables,
    platformData: {
      settings: { restart },
      publishing: {
        locales = ['en-US'],
        summary = '',
        description = '',
        keywords = '',
        invocations,
        category,
        hasPurchase = false,
        personal = false,
        hasAds = false,
        forChildren = false,
        forExport = false,
        instructions = '',
        smallIcon,
        largeIcon,
        termsAndConditions = '',
        privacyPolicy = '',
        invocationName = '',
      } = {},
    },
  }) => ({
    id: _id,
    name,
    creatorID,
    projectID,
    rootDiagramID,
    diagramID: rootDiagramID,
    platform: PlatformType.ALEXA,
    locales,
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
      summary,
      description,
      keywords,
      invocations: { value: invocations || [] },
      category,
      purchase: hasPurchase,
      personal,
      copa: forChildren,
      ads: hasAds,
      export: forExport,
      instructions,
      stage: 0,
      restart,
      smallIcon,
      largeIcon,
      termsAndCond: termsAndConditions,
      privacyPolicy,
      invName: invocationName,
    },
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default alexaVersionAdapter;
