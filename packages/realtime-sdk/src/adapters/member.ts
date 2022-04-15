import { DBMember } from '@realtime-sdk/models';
import createAdapter from 'bidirectional-adapter';

const memberAdapter = createAdapter<DBMember, DBMember>(
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
