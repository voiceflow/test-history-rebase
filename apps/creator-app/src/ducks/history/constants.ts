import { HistoryState } from './types';

export const MAX_HISTORY_LENGTH = 100;

export const STATE_KEY = 'history';

export const INITIAL_STATE: HistoryState = {
  buffer: null,
  undo: [],
  redo: [],
  ignore: [],
};
