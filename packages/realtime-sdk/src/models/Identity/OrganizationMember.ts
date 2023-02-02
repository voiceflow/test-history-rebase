import { UserRole } from '@voiceflow/internal';

import { User } from './User';

export interface OrganizationMember {
  user: User;
  membership: { role: UserRole; organizationID: string };
}
