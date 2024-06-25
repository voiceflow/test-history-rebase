import type { UserRole } from '@voiceflow/dtos';

import type { User } from './User';

export interface WorkspaceMember {
  user: User;
  membership: { role: UserRole; workspaceID: string };
}
