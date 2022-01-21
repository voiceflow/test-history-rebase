import compositeReducer from 'composite-reducer';

import { createRootCRUDReducer } from '@/ducks/utils/crudV2';
import { RootReducer } from '@/store/types';

import { UpdateSelectedVariableState, VariableStateAction } from '../actions';
import { INITIAL_STATE } from '../constants';
import { VariableStateCRUDState } from '../types';
import crudReducers from './crud';

const updateSelectedIDReducer: RootReducer<string | null, UpdateSelectedVariableState> = (state = null, action) =>
  action.type === VariableStateAction.UPDATE_SELECTED_ID ? action.payload : state;

const variableStateCRUDReducer = createRootCRUDReducer<VariableStateCRUDState>(INITIAL_STATE, crudReducers).build();

const variableStateReducer = compositeReducer(variableStateCRUDReducer, { selectedID: updateSelectedIDReducer });

export default variableStateReducer;
