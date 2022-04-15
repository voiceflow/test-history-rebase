import { DBProjectList, ProjectList } from '@realtime-sdk/models';
import createAdapter from 'bidirectional-adapter';

const projectListAdapter = createAdapter<DBProjectList, ProjectList>(
  ({ board_id, name, projects }) => ({
    id: board_id,
    name,
    projects,
  }),
  ({ id, name, projects }) => ({
    name,
    board_id: id,
    projects,
  })
);

export default projectListAdapter;
