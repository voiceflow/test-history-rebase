import { Project as DBProject } from '@voiceflow/api-sdk';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { Project } from '@/models';

const projectAdapter = createAdapter<DBProject<any, any>, Project>(
  ({ _id, name, devVersion }) => ({
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
    created: '',
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default projectAdapter;
