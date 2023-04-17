import { SAMLProvider } from '@/models';

import { apiV2 } from './fetch';

export const ORGANIZATIONS_PATH = 'organizations';

const organizationClient = {
  checkDomain: (domain: string) => apiV2.get<string | null>(`${ORGANIZATIONS_PATH}`, { query: { domain } }).catch(() => null),
  getSAMLLogin: (organizationID: string) => apiV2.get<Pick<SAMLProvider, 'entryPoint'>>(`${ORGANIZATIONS_PATH}/${organizationID}/saml/login`),
};

export default organizationClient;
