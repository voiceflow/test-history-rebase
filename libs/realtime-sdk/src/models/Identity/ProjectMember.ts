import { UserRole } from '@voiceflow/internal';

import { User } from './User';

export interface ProjectMember {
  user: User;
  membership: { role: UserRole.VIEWER | UserRole.EDITOR; projectID: string };
}
