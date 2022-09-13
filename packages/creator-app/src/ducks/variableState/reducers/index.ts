import * as Realtime from '@voiceflow/realtime-sdk';
import compositeReducer from 'composite-reducer';

import { createRootCRUDReducer } from '@/ducks/utils/crudV2';
import { RootReducer } from '@/store/types';

import { SelectedStateActions, VariableStateAction } from '../actions';
import { INITIAL_STATE } from '../constants';
import crudReducers from './crud';

const updateSelectedReducer: RootReducer<Partial<Realtime.VariableState> | null, SelectedStateActions> = (state = null, action) => {
  switch (action.type) {
    case VariableStateAction.UPDATE_SELECTED_STATE:
      return action.payload;
    case VariableStateAction.UPDATE_VARIABLES:
      return { ...state, variables: { ...state?.variables, ...action.payload } };
    default:
      return state;
  }
};

const variableStateCRUDReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers).build();

const variableStateReducer = compositeReducer(variableStateCRUDReducer, { selectedState: updateSelectedReducer });

export default variableStateReducer;
