import { AlexaProject } from '@voiceflow/alexa-types';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { Project } from '@/models';

const projectAdapter = createAdapter<AlexaProject, Project>(
  ({ _id, name, devVersion, created }) => ({
    id: _id,
    name,
    locales: [],
    module: '',
    diagramID: '',
    reference: false,
    isLive: false,
    versionID: devVersion!,
    smallIcon: null,
    largeIcon: null,
    created: created ? new Date(created).toString() : '', // TODO: remove when created will be sent for the template projects
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default projectAdapter;
