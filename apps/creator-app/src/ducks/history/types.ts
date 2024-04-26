import type { Action } from 'typescript-fsa';

// allows us to group actions that are not purely atomic
export interface Transaction {
  id: string;
  apply: Action<any>[];
  revert: Action<any>[];
}

export interface HistoryState {
  buffer: Transaction | null;
  undo: Transaction[];
  redo: Transaction[];
  ignore: string[];
}
