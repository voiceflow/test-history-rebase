import type { UserRole } from '@voiceflow/dtos';

export interface CollaboratorType {
  email: string;
  permission: UserRole;
}
