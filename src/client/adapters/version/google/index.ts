import { GoogleVersion, Locale } from '@voiceflow/google-types';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { BUILT_IN_VARIABLES, PlatformType } from '@/constants';
import { FullSkill } from '@/models';

import localesAdapter from './locales';
import publishingAdapter from './publishing';
import settingsAdapter from './settings';

const googleVersionAdapter = createAdapter<GoogleVersion, FullSkill<Locale>>(
  ({ name, _id, creatorID, projectID, rootDiagramID, variables, platformData: { settings, publishing } }) => ({
    id: _id,
    name,
    creatorID,
    projectID,
    rootDiagramID,
    diagramID: rootDiagramID,
    platform: PlatformType.GOOGLE,
    locales: localesAdapter(publishing?.locales),
    globalVariables: variables.filter((variable) => !BUILT_IN_VARIABLES.includes(variable)),
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

export default googleVersionAdapter;
