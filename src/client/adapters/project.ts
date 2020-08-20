import { DBProject, Project } from '@/models';

import { AdapterNotImplementedError, createAdapter } from './utils';

const projectAdapter = createAdapter<DBProject, Project>(
  ({ project_id, skill_id, name, diagram, locales, module, reference, created, islive, small_icon, large_icon, platform }) => ({
    id: project_id,
    name,
    diagramID: diagram,
    locales,
    platform,
    module,
    reference,
    created,
    isLive: islive,
    versionID: skill_id,
    smallIcon: small_icon,
    largeIcon: large_icon,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default projectAdapter;
