import { UserRole } from '@voiceflow/dtos';

export interface WorkspaceInvite {
  role: UserRole;
  email: string;
  expiry: string;
}
