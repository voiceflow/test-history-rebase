export const VersionNLUUnclassifiedDataType = {
  PROTOTYPE: 'prototype',
  CONVERSATION: 'conversation',
  NLU_DATA_SOURCEIMPORT: 'nluDatasourceImport',
} as const;

export type VersionNLUUnclassifiedDataType =
  (typeof VersionNLUUnclassifiedDataType)[keyof typeof VersionNLUUnclassifiedDataType];
