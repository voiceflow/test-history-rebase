import { createRootReducer } from '../../utils';
import { INITIAL_PROJECT_STATE } from '../constants';
import { RealtimeProjectState } from '../types';
import resetReducer from './reset';

const realtimeProjectReducer = createRootReducer<RealtimeProjectState>(INITIAL_PROJECT_STATE)
  .immerCase(...resetReducer)
  .build();

export default realtimeProjectReducer;
