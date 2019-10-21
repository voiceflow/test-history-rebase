import { createAdapter } from './utils';

const projectAdapter = createAdapter(
  ({ project_id, skill_id, name, diagram, locales, module, reference, created, islive, small_icon, large_icon }) => ({
    id: project_id,
    name,
    diagramID: diagram,
    locales,
    module,
    reference,
    created,
    isLive: islive,
    versionID: skill_id,
    smallIcon: small_icon,
    largeIcon: large_icon,
  }),
  () => ({})
);

export default projectAdapter;
