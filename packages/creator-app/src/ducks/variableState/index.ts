import compositeReducer from 'composite-reducer';

import { VariableState } from '@/models';
import { RootReducer } from '@/store/types';

import createCRUDReducer from '../utils/crud';
import { UpdateSelectedVariableState, VariableStateAction } from './actions';
import { STATE_KEY } from './constants';

export * from './actions';
export * from './constants';
export * from './selectors';
export * from './types';

const variableStateCRUDReducer = createCRUDReducer<VariableState>(STATE_KEY);

const updateSelectedIDReducer: RootReducer<string | null, UpdateSelectedVariableState> = (state = null, action) =>
  action.type === VariableStateAction.UPDATE_SELECTED_ID ? action.payload : state;

const variableStateReducer = compositeReducer(variableStateCRUDReducer, { selectedID: updateSelectedIDReducer });

export default variableStateReducer;
