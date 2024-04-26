import type { UserRole } from '@voiceflow/internal';

import type { User } from './User';

export interface WorkspaceMember {
  user: User;
  membership: { role: UserRole; workspaceID: string };
}
