import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const upsertNoteReducer = createReducer(Realtime.note.upsert, (state, { note }) => {
  if (Normal.hasOne(state, note.id)) {
    return Normal.updateOne(state, note.id, note);
  }

  return Normal.appendOne(state, note.id, note);
});

export default upsertNoteReducer;
