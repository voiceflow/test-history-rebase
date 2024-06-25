import type { IntegrationType } from './dtos/base-oauth-type.enum';

interface BaseOauthClient {
  readonly type: IntegrationType;

  fetchAccessToken({
    code,
    scope,
    redirectUrl,
    subdomain,
  }: {
    code: string;
    scope: string;
    redirectUrl: string;
    subdomain?: string;
  }): Promise<string>;
  fetchFilters(accessToken: string, integrationSubdomain: string, subdomain?: string): Promise<object>;
  getAuthPageUrl({
    creatorID,
    overwrite,
    projectID,
    scope,
    redirectUrl,
    subdomain,
  }: {
    creatorID: number;
    overwrite: boolean;
    projectID: string;
    scope: string;
    redirectUrl: string;
    subdomain?: string;
  }): string;
  fetchCountByFilters(accessToken: string, filters?: object): Promise<object>;
}

export default BaseOauthClient;
