import { AccountLinking } from '@voiceflow/alexa-types';

import { createAdapter } from '@/client/adapters/utils';
import { AccountLinking as AccountLinkingModel } from '@/models';

const accountLinkingAdapter = createAdapter<AccountLinking, AccountLinkingModel>(
  // db to app
  ({ type, scopes, domains, clientId, clientSecret, accessTokenUrl, authorizationUrl, accessTokenScheme, defaultTokenExpirationInSeconds }) => ({
    type,
    scopes,
    domains,
    clientId,
    clientSecret,
    accessTokenUrl,
    authorizationUrl,
    accessTokenScheme,
    defaultTokenExpirationInSeconds,
  }),
  // app to db
  // eslint-disable-next-line sonarjs/no-identical-functions
  ({ type, scopes, domains, clientId, clientSecret, accessTokenUrl, authorizationUrl, accessTokenScheme, defaultTokenExpirationInSeconds }) => ({
    type,
    scopes,
    domains,
    clientId,
    clientSecret,
    accessTokenUrl,
    authorizationUrl,
    accessTokenScheme,
    defaultTokenExpirationInSeconds,
  })
);

export default accountLinkingAdapter;
