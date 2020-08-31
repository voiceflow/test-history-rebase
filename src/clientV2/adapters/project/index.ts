import { Project as DBProject } from '@voiceflow/api-sdk';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { PlatformType } from '@/constants';
import { Project } from '@/models';

const projectAdapter = createAdapter<DBProject<Record<string, unknown>, Record<string, unknown>>, Project>(
  ({ _id, name, devVersion, created, platform }) => ({
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
    platform: platform as PlatformType,
    created: created ? new Date(created).toString() : '', // TODO: remove when created will be sent for the template projects
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default projectAdapter;
