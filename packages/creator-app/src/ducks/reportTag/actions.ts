import { createCRUDActionCreators } from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

const {
  add: addReportTag,
  addMany: addReportTags,
  remove: removeReportTag,
  update: updateReportTag,
  patch: patchReportTag,
  replace: replaceReportTags,
} = createCRUDActionCreators(STATE_KEY);

export { addReportTag, addReportTags, patchReportTag, removeReportTag, replaceReportTags, updateReportTag };
