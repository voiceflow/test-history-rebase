import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const loadNoteReducer = createReducer(Realtime.note.load, (_state, { notes }) => Normal.normalize(notes));

export default loadNoteReducer;
