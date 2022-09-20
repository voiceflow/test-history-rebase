export const DIALOGFLOW_LEARN_MORE = 'https://cloud.google.com/dialogflow/es/docs/agents-overview';
export const getDialogflowAgentUrl = (projectID: string) => `https://dialogflow.cloud.google.com/#/editAgent/${projectID}/`;
export const getDialogflowProjectConsoleUrl = (projectID: string) => `https://dialogflow.cloud.google.com/#/editAgent/${projectID}/`;

export enum DialogflowStageType {
  IDLE = 'IDLE',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  PROGRESS = 'PROGRESS',
  WAIT_ACCOUNT = 'WAIT_ACCOUNT',
  WAIT_PROJECT = 'WAIT_PROJECT',
}

export enum DialogflowPublishJobErrorType {
  RENDERING = 'RENDERING',
  ENABLING_SKILL = 'ENABLING_SKILL',
  SUBMITTING_PROJECT = 'SUBMITTING_PROJECT',
  SUBMITTING_FOR_REVIEW = 'SUBMITTING_FOR_REVIEW',
  CHECKING_INTERACTION_MODEL_STATUS = 'CHECKING_INTERACTION_MODEL_STATUS',
}
