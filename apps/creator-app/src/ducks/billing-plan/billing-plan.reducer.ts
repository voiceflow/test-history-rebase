import { Actions } from '@voiceflow/sdk-logux-designer';
import { normalize } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { type BillingPlanState, INITIAL_STATE } from './billing-plan.state';

export const billingPlanReducer = reducerWithInitialState<BillingPlanState>(INITIAL_STATE)
  .case(Actions.BillingPlan.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))

  .build();
