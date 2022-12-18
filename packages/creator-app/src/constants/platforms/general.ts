export enum GeneralStageType {
  IDLE = 'IDLE',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  PROGRESS = 'PROGRESS',
}

export enum GeneralJobErrorType {
  RENDERING = 'RENDERING',
}

export enum NLPTrainStageType {
  IDLE = 'IDLE',
  ERROR = 'ERROR',
  CONFIRM = 'CONFIRM',
  SUCCESS = 'SUCCESS',
  PROGRESS = 'PROGRESS',
}

export enum NLPTrainJobErrorType {
  TRAINING = 'TRAINING',
  COMPILING = 'COMPILING',
  UPLOADING = 'UPLOADING',
  PUBLISHING = 'PUBLISHING',
}
