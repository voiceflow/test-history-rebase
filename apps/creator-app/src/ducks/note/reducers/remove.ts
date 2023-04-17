import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const removeNoteReducer = createReducer(Realtime.note.remove, (state, { noteID }) => Normal.removeOne(state, noteID));

export default removeNoteReducer;
