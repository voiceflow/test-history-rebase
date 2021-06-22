import { createCRUDActionCreators } from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

const {
  add: addTranscript,
  addMany: addTranscripts,
  remove: removeTranscript,
  replace: replaceTranscripts,
  update: updateTranscript,
  patch: patchTranscript,
} = createCRUDActionCreators(STATE_KEY);

export { addTranscript, addTranscripts, patchTranscript, removeTranscript, replaceTranscripts, updateTranscript };
