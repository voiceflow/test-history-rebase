import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendOne, getOne, normalize, patchOne, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { INITIAL_STATE, type OrganizationState } from './organization.state';

export const organizationReducer = reducerWithInitialState<OrganizationState>(INITIAL_STATE)
  .case(Actions.Organization.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Organization.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.Organization.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Organization.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))
  .case(Actions.OrganizationMember.DeleteOne, (state, { context, id }) => {
    const organization = getOne(state, context.organizationID);
    return !organization
      ? state
      : patchOne(state, context.organizationID, { members: organization.members.filter((m) => m.id !== id) });
  })
  .case(Actions.OrganizationSubscription.Replace, (state, { context, subscription }) => {
    const organization = getOne(state, context.organizationID);
    return organization ? patchOne(state, context.organizationID, { subscription }) : state;
  })
  .case(Actions.OrganizationSubscription.UpdatePaymentMethod, (state, { context, paymentMethod }) => {
    const { organizationID } = context;
    const organization = getOne(state, organizationID);

    if (!organization?.subscription) return state;

    return patchOne(state, context.organizationID, {
      subscription: {
        ...organization.subscription,
        paymentMethod,
      },
    });
  })
  .case(Actions.OrganizationMember.Replace, (state, { context, data }) => {
    const organization = getOne(state, context.organizationID);
    if (!organization) return state;

    return patchOne(state, context.organizationID, { members: data });
  })
  .build();
