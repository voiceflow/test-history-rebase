import { createAdapter } from './utils';

const userAdapter = createAdapter(
  ({ id, creator_id, name, email, ...user }) => ({
    id: id || creator_id,
    name,
    email,
    ...user,
  }),
  ({ id, name, email, ...user }) => ({
    creator_id: id,
    name,
    email,
    ...user,
  })
);

export default userAdapter;
