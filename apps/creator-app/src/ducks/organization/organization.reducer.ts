import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendOne, getOne, normalize, patchOne, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { INITIAL_STATE, type OrganizationState } from './organization.state';

export const organizationReducer = reducerWithInitialState<OrganizationState>(INITIAL_STATE)
  .case(Actions.Organization.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Organization.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.Organization.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Organization.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))

  // TODO: create members sub reducer
  .case(Actions.OrganizationMember.DeleteOne, (state, { context, id }) => {
    const { organizationID } = context;
    const organization = getOne(state, organizationID);

    if (!organization) return state;

    return patchOne(state, organizationID, { members: organization.members.filter((m) => m.creatorID !== id) });
  })

  // TODO: create subscription sub reducer
  .case(Actions.OrganizationSubscription.Replace, (state, { context, subscription }) => {
    const { organizationID } = context;
    const organization = getOne(state, organizationID);

    if (organization && organization?.chargebeeSubscriptionID === subscription?.id) {
      return patchOne(state, organizationID, { subscription });
    }

    return state;
  })

  .build();
