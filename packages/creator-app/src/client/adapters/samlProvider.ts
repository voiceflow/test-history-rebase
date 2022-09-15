import { createMultiAdapter } from 'bidirectional-adapter';

import { SAMLProvider } from '@/models';

const samlProviderAdapter = createMultiAdapter<SAMLProvider, SAMLProvider>(
  ({ _id, issuer, entryPoint, certificate, organizationID }) => ({
    _id,
    issuer: issuer || '',
    organizationID,
    entryPoint: entryPoint || '',
    certificate: certificate || '',
  }),
  ({ _id, issuer, organizationID, entryPoint, certificate }) => ({
    _id,
    issuer,
    organizationID,
    entryPoint,
    certificate,
  })
);

export default samlProviderAdapter;
