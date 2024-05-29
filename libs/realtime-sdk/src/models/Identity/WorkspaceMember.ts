import { UserRole } from '@voiceflow/dtos';

import { User } from './User';

export interface WorkspaceMember {
  user: User;
  membership: { role: UserRole; workspaceID: string };
}
