import type { UserRole } from '@voiceflow/internal';

export interface OrganizationMember {
  name: string;
  role: UserRole;
  email: string;
  image: string | null;
  creatorID: number;
}
