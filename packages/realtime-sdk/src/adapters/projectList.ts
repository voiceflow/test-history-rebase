/* eslint-disable camelcase */
import createAdapter from 'bidirectional-adapter';

import { DBProjectList, ProjectList } from '../models';

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
