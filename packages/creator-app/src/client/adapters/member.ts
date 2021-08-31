import { Adapters } from '@voiceflow/realtime-sdk';

import { DBMember } from '@/models';

const memberAdapter = Adapters.createAdapter<DBMember, DBMember>(
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
