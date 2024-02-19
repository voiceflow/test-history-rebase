import { Actions } from '@voiceflow/sdk-logux-designer';
import * as Normal from 'normal-store';

import { createOrganizationReducer } from '../organization.utils';

export const removeMemberReducer = createOrganizationReducer(Actions.OrganizationMember.DeleteOne, (state, { context, id }) => {
  const { organizationID } = context;

  const organization = Normal.getOne(state, organizationID);

  if (!organization) return;

  organization.members = organization.members.filter((m) => m.creatorID !== id);
});
