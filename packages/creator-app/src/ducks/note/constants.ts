import * as Normal from 'normal-store';

import { NoteRootState } from './types';

export const STATE_KEY = 'note';

export const INITIAL_STATE: NoteRootState = Normal.createEmpty();
