import type { UserRole } from '@voiceflow/dtos';

export interface Member {
  role: UserRole;
  name: string | null;
  image: string | null;
  email: string;
  expiry?: string;
  projects?: string[];
  creator_id: number | null;
  isOrganizationAdmin?: boolean;
}
