import type { UserRole } from '@voiceflow/internal';

import type { User } from './User';

export interface ProjectMember {
  user: User;
  membership: { role: UserRole.VIEWER | UserRole.EDITOR; projectID: string };
}
