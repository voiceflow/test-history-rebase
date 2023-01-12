import { IdentityOrganization, Organization } from '@realtime-sdk/models';
import { createMultiAdapter } from 'bidirectional-adapter';

const organizationAdapter = createMultiAdapter<IdentityOrganization, Organization>(
  ({ id, name, ...rest }) => ({ id, name, ...rest }),
  ({ id, name, ...rest }) => ({ id, name, ...rest })
);

export default organizationAdapter;
