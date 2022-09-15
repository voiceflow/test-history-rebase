import { DBMember } from '@realtime-sdk/models';
import { createMultiAdapter } from 'bidirectional-adapter';

const memberAdapter = createMultiAdapter<DBMember, DBMember>(
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
