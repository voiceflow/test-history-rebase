import { Utils } from '@voiceflow/common';
import type { UserRole } from '@voiceflow/internal';

import type { WorkspaceAction } from '../workspace.action';
import { workspaceAction } from '../workspace.action';
import type { WorkspaceInvite } from './workspace-invite.interface';

const inviteType = Utils.protocol.typeFactory(workspaceAction('invite'));

interface BaseInvitePayload extends WorkspaceAction {
  email: string;
}

export interface Add extends WorkspaceAction {
  invite: WorkspaceInvite;
}

export const Add = Utils.protocol.createAction<Add>(inviteType('Add'));

export namespace Send {
  export interface Request extends BaseInvitePayload {
    role: UserRole;
  }

  export type Response = WorkspaceInvite | null;
}

export const Send = Utils.protocol.createAsyncAction<Send.Request, Send.Response>(inviteType('SEND'));

export interface Renew extends BaseInvitePayload {
  role: UserRole;
}

export const Renew = Utils.protocol.createAction<Renew>(inviteType('RENEW'));

export interface Update extends BaseInvitePayload {
  role: UserRole;
}

export const Update = Utils.protocol.createAction<Update>(inviteType('UPDATE'));

export namespace Accept {
  export interface Request {
    invite: string;
  }

  export type Response = string;
}

export const Accept = Utils.protocol.createAsyncAction<Accept.Request, Accept.Response>(inviteType('ACCEPT'));

export interface Cancel extends BaseInvitePayload {}

export const Cancel = Utils.protocol.createAction<Cancel>(inviteType('CANCEL'));
