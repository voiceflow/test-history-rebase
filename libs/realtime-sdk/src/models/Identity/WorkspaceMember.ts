import { UserRole } from '@voiceflow/internal';

import { User } from './User';

export interface WorkspaceMember {
  user: User;
  membership: { role: UserRole; organizationRole?: UserRole; workspaceID: string };
}
