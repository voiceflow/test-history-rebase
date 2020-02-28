import { AdapterNotImplementedError, createAdapter } from './utils';

const templateAdapter = createAdapter(
  ({ module_id, module_project_id, project_id, creator_id, title, descr, module_icon, color }) => ({
    id: module_id,
    moduleProjectID: module_project_id,
    projectID: project_id,
    creatorID: creator_id,
    title,
    description: descr,
    icon: module_icon,
    color,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default templateAdapter;
