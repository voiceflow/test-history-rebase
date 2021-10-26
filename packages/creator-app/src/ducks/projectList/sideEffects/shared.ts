import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import { SyncThunk } from '@/store/types';

import { addProjectToListAction } from '../actions';

/**
 * @deprecated list management behaviour has been moved to the realtime service
 */
export const addProjectToList =
  (listID: string, projectID: string): SyncThunk =>
  async (dispatch, getState) => {
    const state = getState();
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);
    if (isAtomicActions) return;

    dispatch(addProjectToListAction(listID, projectID));
  };
