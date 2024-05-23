import { Identity, PendingWorkspaceMember } from '@realtime-sdk/models';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

const workspaceInviteAdapter = createMultiAdapter<Identity.WorkspaceInvite, PendingWorkspaceMember>(
  ({ role, email, expiry }) => ({
    name: null,
    role,
    email,
    image: null,
    expiry,
    created: null,
    creatorID: null,
  }),
  notImplementedAdapter.transformer
);

export default workspaceInviteAdapter;
