import { createMultiAdapter } from 'bidirectional-adapter';

import type { DBProjectList, ProjectList } from '@/models';

const projectListAdapter = createMultiAdapter<DBProjectList, ProjectList>(
  ({ board_id, name, projects = [] }) => ({
    id: board_id,
    name,
    projects,
  }),
  ({ id, name, projects = [] }) => ({
    name,
    board_id: id,
    projects,
  })
);

export default projectListAdapter;
