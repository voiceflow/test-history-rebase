import { UserRole } from '@voiceflow/dtos';

import { User } from './User';

export interface OrganizationMember {
  user: User;
  membership: { role: UserRole; organizationID: string };
}
