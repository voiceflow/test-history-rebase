export const TABS = [
  {
    value: 'client',
    label: 'client',
  },
  {
    value: 'scope',
    label: 'scope',
  },
  {
    value: 'domain',
    label: 'domain',
  },
];

export const CLIENT_AUTH_SCHEMES = [
  { value: 'HTTP_BASIC', label: 'HTTP Basic (recommended)' },
  { value: 'REQUEST_BODY_CREDENTIALS', label: 'Credentials in request body' },
];

export const EMPTY_ACCOUNT_DATA = {
  skipOnEnablement: false,
  type: 'AUTH_CODE',
  authorizationUrl: '',
  domains: [''],
  clientId: '',
  scopes: [''],
  accessTokenUrl: '',
  clientSecret: '',
  accessTokenScheme: 'HTTP_BASIC',
  defaultTokenExpirationInSeconds: 3600,
};

export const HELP_LINK = 'https://docs.voiceflow.com/voiceflow-documentation/linking-to-external-accounts/alexa-skill-account-linking';
