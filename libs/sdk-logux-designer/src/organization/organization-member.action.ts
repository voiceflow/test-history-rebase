import { MEMBER_KEY } from '@realtime-sdk/constants';
import type { BaseOrganizationPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

import { organizationType } from './utils';

const memberType = Utils.protocol.typeFactory(organizationType(MEMBER_KEY));

export interface BaseMemberPayload extends BaseOrganizationPayload {
  creatorID: number;
}

export const remove = Utils.protocol.createAction<BaseMemberPayload>(memberType('REMOVE'));
