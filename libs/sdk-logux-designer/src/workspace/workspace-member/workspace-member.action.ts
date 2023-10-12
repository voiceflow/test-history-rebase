import { Utils } from '@voiceflow/common';

import type { WorkspaceAction } from '../workspace.action';
import { workspaceAction } from '../workspace.action';
import type { WorkspaceMember } from './workspace-member.interface';

const workspaceMemberType = Utils.protocol.typeFactory(workspaceAction('member'));

interface BaseMemberPayload extends WorkspaceAction {
  creatorID: number;
}

export interface Add extends WorkspaceAction {
  member: WorkspaceMember;
}

export const Add = Utils.protocol.createAction<Add>(workspaceMemberType('ADD'));

export interface Patch extends BaseMemberPayload {
  member: Pick<WorkspaceMember, 'role'>;
}

export const Patch = Utils.protocol.createAction<Patch>(workspaceMemberType('PATCH'));

export interface Eject extends BaseMemberPayload {
  removed?: boolean;
  workspaceName: string;
}

export const Eject = Utils.protocol.createAction<Eject>(workspaceMemberType('EJECT'));

export interface Remove extends BaseMemberPayload {}

export const Remove = Utils.protocol.createAction<Remove>(workspaceMemberType('REMOVE'));
