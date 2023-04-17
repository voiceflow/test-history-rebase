import samlProviderAdapter from '@/client/adapters/samlProvider';
import { SAMLProvider } from '@/models';

import { apiV2 } from './fetch';
import { ORGANIZATIONS_PATH } from './organization';

export const SAML_PATH = 'saml';

const samlClient = {
  update: (provider: SAMLProvider) => apiV2.post(`${SAML_PATH}/${provider._id}`, samlProviderAdapter.toDB(provider)),

  validations: (_id: string) => apiV2.post(`${SAML_PATH}/${_id}/validations`),

  getForOrganization: (organizationID: string) =>
    apiV2.get<SAMLProvider>(`${ORGANIZATIONS_PATH}/${organizationID}/saml`).then(samlProviderAdapter.fromDB),
};

export default samlClient;
