import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import type { Identity, PendingWorkspaceMember } from '@/models';

const workspaceInviteAdapter = createMultiAdapter<Identity.WorkspaceInvite, PendingWorkspaceMember>(
  ({ role, email, expiry }) => ({
    name: null,
    role,
    email,
    image: null,
    expiry,
    created: null,
    creator_id: null,
  }),
  notImplementedAdapter.transformer
);

export default workspaceInviteAdapter;
