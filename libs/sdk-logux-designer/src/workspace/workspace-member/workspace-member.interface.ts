import type { UserRole } from '@voiceflow/internal';

export interface WorkspaceMember {
  role: UserRole;
  name: string;
  email: string;
  image: string;
  creatorID: number;
}
