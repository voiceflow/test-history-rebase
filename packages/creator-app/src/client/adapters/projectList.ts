import { DBProjectList, ProjectList } from '@/models';

import { createAdapter } from './utils';

const projectListAdapter = createAdapter<DBProjectList, ProjectList>(
  ({ board_id, name, projects }) => ({
    id: board_id,
    name,
    projects,
  }),
  ({ id, name, projects }) => ({
    board_id: id,
    name,
    projects,
  })
);

export default projectListAdapter;
