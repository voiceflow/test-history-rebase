import { AnyWorkspaceMember, PendingWorkspaceMember, WorkspaceMember } from '@realtime-sdk/models';

export const isWorkspaceMember = (member: AnyWorkspaceMember | null): member is WorkspaceMember => !!member?.creator_id;

export const isWorkspacePendingMember = (member: AnyWorkspaceMember | null): member is PendingWorkspaceMember => !isWorkspaceMember(member);
