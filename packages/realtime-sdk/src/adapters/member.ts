import { DBMember } from '../models';
import { createAdapter } from './utils';

const memberAdapter = createAdapter<DBMember, DBMember>(
  // eslint-disable-next-line camelcase
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
