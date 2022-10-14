import { PendingWorkspaceMember, WorkspaceMember } from '@realtime-sdk/models';
import { createMultiAdapter } from 'bidirectional-adapter';

const memberAdapter = createMultiAdapter<WorkspaceMember | PendingWorkspaceMember, WorkspaceMember | PendingWorkspaceMember>(
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
