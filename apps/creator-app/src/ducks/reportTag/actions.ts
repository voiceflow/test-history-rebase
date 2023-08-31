import { Utils } from '@voiceflow/common';
import { actionUtils } from '@voiceflow/realtime-sdk';

import { ReportTag } from '@/models';

import { STATE_KEY } from './constants';

const reportTypeTag = Utils.protocol.typeFactory(STATE_KEY);

export const crudActions = actionUtils.createCRUDActions<ReportTag>(reportTypeTag);

export const {
  add: addReportTag,
  patch: patchReportTag,
  remove: removeReportTag,
  update: updateReportTag,
  addMany: addReportTags,
  replace: replaceReportTags,
} = crudActions;
