import { createCRUDActionCreators } from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

const { add: addTranscript, addMany: addTranscripts, remove: removeTranscript } = createCRUDActionCreators(STATE_KEY);

export { addTranscript, addTranscripts, removeTranscript };
