import { INVITE_KEY, MEMBER_KEY } from '@realtime-sdk/constants';
import { DBMember } from '@realtime-sdk/models';
import { BaseCreatorPayload, BaseWorkspacePayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';

import { workspaceType } from './utils';

const memberType = Utils.protocol.typeFactory(workspaceType(MEMBER_KEY));
const inviteType = Utils.protocol.typeFactory(memberType(INVITE_KEY));

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
  removed?: boolean;
  workspaceName: string;
}

export const add = Utils.protocol.createAction<AddMemberPayload>(memberType('ADD'));

export const patch = Utils.protocol.createAction<PatchMemberPayload>(memberType('PATCH'));

export const replace = Utils.protocol.createAction<ReplaceMembersPayload>(memberType('REPLACE'));

export const eject = Utils.protocol.createAction<EjectPayload>(memberType('EJECT'));

export const remove = Utils.protocol.createAction<BaseMemberPayload>(memberType('REMOVE'));

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

export const acceptInvite = Utils.protocol.createAsyncAction<AcceptInvitePayload, string>(inviteType('ACCEPT'));

export const sendInvite = Utils.protocol.createAsyncAction<SendInvitePayload, DBMember | null>(inviteType('SEND'));

export const updateInvite = Utils.protocol.createAction<UpdateInvitePayload>(inviteType('UPDATE'));

export const cancelInvite = Utils.protocol.createAction<BaseInvitePayload>(inviteType('CANCEL'));
