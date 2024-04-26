import type { UserRole } from '@voiceflow/internal';

import type { User } from './User';

export interface OrganizationMember {
  user: User;
  membership: { role: UserRole; organizationID: string };
}
