import { Utils } from '@voiceflow/common';
import type { UserRole } from '@voiceflow/internal';

import { INVITE_KEY, MEMBER_KEY } from '@/constants';
import type { AnyWorkspaceMember, PendingWorkspaceMember } from '@/models';
import type { BaseCreatorPayload, BaseWorkspacePayload } from '@/types';

import { workspaceType } from './utils';

const memberType = Utils.protocol.typeFactory(workspaceType(MEMBER_KEY));
const inviteType = Utils.protocol.typeFactory(memberType(INVITE_KEY));

export interface BaseMemberPayload extends BaseWorkspacePayload {
  creatorID: number;
}

export interface AddMemberPayload extends BaseWorkspacePayload {
  member: AnyWorkspaceMember;
}

export interface PatchMemberPayload extends BaseMemberPayload {
  member: Pick<AnyWorkspaceMember, 'role'>;
}

export interface ReplaceMembersPayload extends BaseWorkspacePayload {
  members: AnyWorkspaceMember[];
}

export interface EjectPayload extends BaseMemberPayload {
  removed?: boolean;
  workspaceName: string;
}

export const add = Utils.protocol.createAction<AddMemberPayload>(memberType('ADD'));

export const patch = Utils.protocol.createAction<PatchMemberPayload>(memberType('PATCH'));

export const eject = Utils.protocol.createAction<EjectPayload>(memberType('EJECT'));

export const remove = Utils.protocol.createAction<BaseMemberPayload>(memberType('REMOVE'));

export const replace = Utils.protocol.createAction<ReplaceMembersPayload>(memberType('REPLACE'));

// invite

export interface BaseInvitePayload extends BaseWorkspacePayload {
  email: string;
}

export interface AcceptInvitePayload extends BaseCreatorPayload {
  invite: string;
}

export interface SendInvitePayload extends BaseInvitePayload {
  role: UserRole;
}

export interface UpdateInvitePayload extends BaseInvitePayload {
  role: UserRole;
}

export interface RenewInvitePayload extends BaseInvitePayload {
  role: UserRole;
}

export const sendInvite = Utils.protocol.createAsyncAction<SendInvitePayload, PendingWorkspaceMember | null>(
  inviteType('SEND')
);

export const renewInvite = Utils.protocol.createAction<RenewInvitePayload>(inviteType('RENEW'));

export const updateInvite = Utils.protocol.createAction<UpdateInvitePayload>(inviteType('UPDATE'));

export const acceptInvite = Utils.protocol.createAsyncAction<AcceptInvitePayload, string>(inviteType('ACCEPT'));

export const cancelInvite = Utils.protocol.createAction<BaseInvitePayload>(inviteType('CANCEL'));
