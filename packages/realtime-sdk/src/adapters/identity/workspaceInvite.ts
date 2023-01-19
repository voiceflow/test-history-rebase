import { Identity, PendingWorkspaceMember } from '@realtime-sdk/models';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import _ from 'lodash';

const workspaceInviteAdapter = createMultiAdapter<Identity.WorkspaceInvite, PendingWorkspaceMember>(
  ({ role, email }) => ({
    name: null,
    role,
    email,
    image: null,
    created: '',
    creator_id: null,
  }),
  notImplementedAdapter.transformer
);

export default workspaceInviteAdapter;
