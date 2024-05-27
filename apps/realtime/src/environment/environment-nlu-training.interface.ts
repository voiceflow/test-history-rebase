export interface HashedRecordDiff {
  new: string[];
  deleted: string[];
  updated: string[];
}

export interface ModelDiff {
  slots: HashedRecordDiff;
  intents: HashedRecordDiff;
}
