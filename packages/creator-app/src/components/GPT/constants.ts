export enum ServerErrorStatusCode {
  SUCCESS = 200,
  INCORRECT_PAYLOAD = 400,
  NOT_AUTHENTICATED = 401,
  QUOTA_REACHED = 403,
  RATE_LIMIT_EXCEEDED = 429,
  ERROR = 500,
}

export enum FeatureToggle {
  GENERATIVE = 'generative',
  GENERATE_STEP = 'generate_step',
  GENERATE_NO_MATCH = 'generate_no_match',
}
