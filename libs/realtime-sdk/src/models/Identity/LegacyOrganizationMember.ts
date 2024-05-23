import { UserRole } from '@voiceflow/internal';

import { User } from './User';

export interface LegacyOrganizationMember {
  user: User;
  membership: { role: UserRole; organizationID: string };
}
