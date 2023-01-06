import * as Errors from '@/config/errors';
import { PrototypeStatus } from '@/constants/prototype';
import * as Session from '@/ducks/session';
import { SyncThunk } from '@/store/types';

import { pushContextHistory, pushPrototypeVisualDataHistory, updatePrototype } from '../actions';
import { Context } from '../types';

const startPublicPrototype = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const activeDiagramID = Session.activeDiagramIDSelector(state);

  Errors.assertDiagramID(activeDiagramID);

  const context: Context = {
    stack: undefined,
    turn: {},
    trace: [],
    storage: {},
    variables: {},
  };

  dispatch(pushContextHistory(context));
  dispatch(pushPrototypeVisualDataHistory(null));
  dispatch(
    updatePrototype({
      status: PrototypeStatus.ACTIVE,
      autoplay: false,
      context,
      startTime: Date.now(),
      flowIDHistory: [activeDiagramID],
    })
  );
};
export default startPublicPrototype;
