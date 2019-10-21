import { createAdapter } from './utils';

const memberAdapter = createAdapter(
  (dbMember) => ({
    id: dbMember.creator_id,
  }),
  (appMember) => ({
    creator_id: appMember.id,
  })
);

export default memberAdapter;
