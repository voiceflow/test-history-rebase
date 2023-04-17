export const DIALOGFLOW_CX_CONSOLE = 'https://dialogflow.cloud.google.com/cx/projects';
export const DIALOGFLOW_CX_LEARN_MORE = 'https://voiceflow.zendesk.com/hc/en-us/articles/9481517869325';
export const getDialogflowCXAgentUrl = (agentName: string) => `https://dialogflow.cloud.google.com/cx/${agentName}/intents`;
export const getDialogflowCXProjectConsoleUrl = (projectID: string) => `https://dialogflow.cloud.google.com/#/editAgent/${projectID}/`;

export enum DialogflowCXStageType {
  IDLE = 'IDLE',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  PROGRESS = 'PROGRESS',
  WAIT_ACCOUNT = 'WAIT_ACCOUNT',
  WAIT_AGENT = 'WAIT_AGENT',
  WAIT_VERSION_NAME = 'WAIT_VERSION_NAME',
}

export enum DialogflowCXPublishJobErrorType {
  ERROR = 'ERROR',
}

export enum DialogflowCXPublishJobSuccessType {
  UPLOAD = 'UPLOAD',
  SUBMIT = 'SUBMIT',
}
