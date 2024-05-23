import { WorkspaceMember } from '@realtime-sdk/models';
import { OrganizationMember } from '@voiceflow/dtos';

export const toLegacyWorkspaceMember = ({ id, role, ...user }: OrganizationMember): WorkspaceMember =>
  ({ ...user, created: '', creator_id: id, role }) as WorkspaceMember;
