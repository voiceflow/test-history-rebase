import { PendingWorkspaceMember, WorkspaceMember } from '@realtime-sdk/models';

export const isWorkspaceMember = (member: WorkspaceMember | PendingWorkspaceMember | null): member is WorkspaceMember => !!member?.creator_id;

export const isWorkspacePendingMember = (member: WorkspaceMember | PendingWorkspaceMember | null): member is PendingWorkspaceMember =>
  !isWorkspaceMember(member);
