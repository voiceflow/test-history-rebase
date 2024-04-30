import { Utils } from '@voiceflow/common';

import { MEMBER_KEY } from '@/constants';
import type { ProjectMember } from '@/models';
import type { BaseProjectPayload } from '@/types';

import { projectType } from './utils';

const memberType = Utils.protocol.typeFactory(projectType(MEMBER_KEY));

export interface BaseMemberPayload extends BaseProjectPayload {
  creatorID: number;
}

export interface AddMemberPayload extends BaseProjectPayload {
  member: ProjectMember;
}

export interface PatchMemberPayload extends BaseMemberPayload {
  member: Pick<ProjectMember, 'role'>;
}

export const add = Utils.protocol.createAction<AddMemberPayload>(memberType('ADD'));

export const patch = Utils.protocol.createAction<PatchMemberPayload>(memberType('PATCH'));

export const remove = Utils.protocol.createAction<BaseMemberPayload>(memberType('REMOVE'));
