export enum SMSPublishStageType {
  CHECK_API_SECRETS = 'CHECK_API_SECRETS',
  CHECK_SERVICE = 'CHECK_SERVICE',
  VALIDATE_NUMBERS = 'VALIDATE_NUMBERS',

  SUCCESS = 'SUCCESS',

  INTEGRATION_INVALID_CREDENTIALS = 'INTEGRATION_INVALID_CREDENTIALS',
  INTEGRATION_RESOURCE_NOT_FOUND = 'INTEGRATION_RESOURCE_NOT_FOUND',

  ERROR = 'ERROR',
  IDLE = 'IDLE',
}

export const SMS_DOCUMENTATION = 'https://developer.voiceflow.com/docs/twilio-sms';
