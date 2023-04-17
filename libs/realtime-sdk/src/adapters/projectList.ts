import { DBProjectList, ProjectList } from '@realtime-sdk/models';
import { createMultiAdapter } from 'bidirectional-adapter';

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
