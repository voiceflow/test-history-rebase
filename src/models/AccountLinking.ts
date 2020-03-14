export type AccountLinking = {
  skipOnEnablement: boolean;
  type: string;
  authorizationUrl: string;
  domains: string[];
  clientId: string;
  scopes: string[];
  accessTokenUrl: string;
  clientSecret: string;
  accessTokenScheme: string;
  defaultTokenExpirationInSeconds: number;
};
