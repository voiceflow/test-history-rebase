import { createAction, createAsyncAction, createType } from '@realtime-sdk/actions/utils';
import { INVITE_KEY, MEMBER_KEY } from '@realtime-sdk/constants';
import { DBMember } from '@realtime-sdk/models';
import { BaseCreatorPayload, BaseWorkspacePayload } from '@realtime-sdk/types';
import { UserRole } from '@voiceflow/internal';

import { workspaceType } from './utils';

const memberType = createType(workspaceType(MEMBER_KEY));
const inviteType = createType(memberType(INVITE_KEY));

export interface BaseMemberPayload extends BaseWorkspacePayload {
  creatorID: number;
}

export interface AddMemberPayload extends BaseMemberPayload {
  member: DBMember;
}

export interface PatchMemberPayload extends BaseMemberPayload {
  member: Pick<DBMember, 'role'>;
}

export interface ReplaceMembersPayload extends BaseWorkspacePayload {
  members: DBMember[];
}

export interface EjectPayload extends BaseMemberPayload {
  workspaceName: string;
}

export const add = createAction<AddMemberPayload>(memberType('ADD'));

export const patch = createAction<PatchMemberPayload>(memberType('PATCH'));

export const replace = createAction<ReplaceMembersPayload>(memberType('REPLACE'));

export const eject = createAction<EjectPayload>(memberType('EJECT'));

export const remove = createAction<BaseMemberPayload>(memberType('REMOVE'));

// invite

export interface BaseInvitePayload extends BaseWorkspacePayload {
  email: string;
}

export interface AcceptInvitePayload extends BaseCreatorPayload {
  invite: string;
}

export interface SendInvitePayload extends BaseInvitePayload {
  role?: UserRole;
}

export interface UpdateInvitePayload extends BaseInvitePayload {
  role: UserRole;
}

export const acceptInvite = createAsyncAction<AcceptInvitePayload, string>(inviteType('ACCEPT'));

export const sendInvite = createAsyncAction<SendInvitePayload, DBMember | null>(inviteType('SEND'));

export const updateInvite = createAction<UpdateInvitePayload>(inviteType('UPDATE'));

export const cancelInvite = createAction<BaseInvitePayload>(inviteType('CANCEL'));
