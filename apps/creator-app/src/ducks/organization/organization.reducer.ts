import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendOne, createEmpty, normalize, patchOne, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

// import { removeMemberReducer } from './member/member.reducer';
import type { OrganizationState } from './organization.state';
// import { replaceScheduledSubscriptionReducer, replaceSubscriptionReducer } from './subscription/subscription.reducer';

const organizationReducer = reducerWithInitialState<OrganizationState>(createEmpty())
  .case(Actions.Organization.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Organization.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.Organization.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Organization.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))

  // .immerCase(...removeMemberReducer)

  // .immerCase(...replaceSubscriptionReducer)
  // .immerCase(...replaceScheduledSubscriptionReducer)

  .build();

export default organizationReducer;
