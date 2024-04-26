import type { UserRole } from '@voiceflow/internal';

export interface WorkspaceInvite {
  role: UserRole;
  email: string;
  expiry: string;
}
