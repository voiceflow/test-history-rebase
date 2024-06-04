import { UserRole } from '@voiceflow/dtos';

export interface CollaboratorType {
  email: string;
  permission: UserRole;
}

export enum TeamSizeType {
  INDIVIDUAL = 'individual',
  SMALL = 'small',
  LARGE = 'large',
}
