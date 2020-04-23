import { DBWorkspace } from '@/models';

import { createAdapter } from './utils';

const memberAdapter = createAdapter<DBWorkspace.Member, DBWorkspace.Member>(
  ({ creator_id, created, email, image, name, status, seats, role }) => ({
    creator_id,
    created,
    email,
    image,
    name,
    status,
    seats,
    role,
  }),
  (data) => ({
    ...data,
  })
);

export default memberAdapter;
