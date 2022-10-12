import { Member, PendingMember } from '@realtime-sdk/models';
import { createMultiAdapter } from 'bidirectional-adapter';

const memberAdapter = createMultiAdapter<Member | PendingMember, Member | PendingMember>(
  ({ creator_id, created, email, image, name, role }) => ({
    role,
    name,
    email,
    image,
    created,
    creator_id,
  }),
  (data) => data
);

export default memberAdapter;
