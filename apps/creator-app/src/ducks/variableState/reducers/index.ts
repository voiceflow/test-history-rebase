import * as Realtime from '@voiceflow/realtime-sdk';
import compositeReducer from 'composite-reducer';

import { createRootCRUDReducer } from '@/ducks/utils/crudV2';
import { createRootReducer } from '@/ducks/utils/reducer';

import { updateSelectedVariableState, updateVariables } from '../actions';
import { INITIAL_STATE } from '../constants';
import crudReducers from './crud';

const selectedVariablesReducer = createRootReducer<Realtime.VariableState | null>(null)
  .case(updateSelectedVariableState, (_, payload) => payload)
  .case(updateVariables, (state, payload) => (state ? { ...state, variables: { ...state.variables, ...payload } } : null));

const variableStateCRUDReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers).build();

const variableStateReducer = compositeReducer(variableStateCRUDReducer, { selectedState: selectedVariablesReducer });

export default variableStateReducer;
