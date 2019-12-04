import { createAdapter } from './utils';

const listAdapter = createAdapter(
  (dbBoard) => ({
    id: dbBoard.board_id,
    name: dbBoard.name,
    projects: dbBoard.projects,
  }),
  (appBoard) => ({
    board_id: appBoard.id,
    name: appBoard.name,
    projects: appBoard.projects,
  })
);

export default listAdapter;
