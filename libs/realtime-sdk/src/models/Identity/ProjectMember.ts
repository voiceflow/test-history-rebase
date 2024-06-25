import type { UserRole } from '@voiceflow/dtos';

import type { User } from './User';

export interface ProjectMember {
  user: Omit<User, 'createdAt' | 'updatedAt'>;
  membership: { role: UserRole; projectID: string };
}
