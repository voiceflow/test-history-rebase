export enum ServerErrorStatusCode {
  SUCCESS = 200,
  INCORRECT_PAYLOAD = 400,
  NOT_AUTHENTICATED = 401,
  QUOTA_REACHED = 403,
  RATE_LIMIT_EXCEEDED = 429,
  ERROR = 500,
}

export enum FeatureToggle {
  FREESTYLE = 'freestyle',
  GENERATIVE = 'generative',
}
