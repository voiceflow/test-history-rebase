export interface VersionNLUUnclassifiedUtterance {
  id?: string;
  sourceID?: string;
  utterance: string;

  /**
   * @deprecated in favor of NLUUnclassifiedData.importedAt
   */
  importedAt?: Date;
}

export interface VersionNLUUnclassifiedData {
  key?: string;
  name: string;
  type: 'conversation' | 'prototype' | 'nluDatasourceImport';
  creatorID?: number;
  utterances: VersionNLUUnclassifiedUtterance[];
  importedAt?: Date;

  /**
   * @deprecated in favor of key
   */
  id?: number;
}
