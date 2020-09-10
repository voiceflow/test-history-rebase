import { AccountLinking, AccountLinkingAccessTokenScheme, AccountLinkingType } from '@voiceflow/alexa-types';

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
  { value: AccountLinkingAccessTokenScheme.HTTP_BASIC, label: 'HTTP Basic (recommended)' },
  { value: AccountLinkingAccessTokenScheme.REQUEST_BODY_CREDENTIALS, label: 'Credentials in request body' },
];

export const EMPTY_ACCOUNT_DATA: AccountLinking = {
  type: AccountLinkingType.AUTH_CODE,
  scopes: [''],
  domains: [''],
  clientId: '',
  clientSecret: '',
  accessTokenUrl: '',
  authorizationUrl: '',
  accessTokenScheme: AccountLinkingAccessTokenScheme.HTTP_BASIC,
  defaultTokenExpirationInSeconds: 3600,
};

export const HELP_LINK = 'https://docs.voiceflow.com';
