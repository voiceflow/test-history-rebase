import { activeDiagramIDSelector, activeProjectIDSelector } from '@/ducks/skill';
import { SyncThunk } from '@/store/types';

import { updatePrototype } from '../actions';
import { prototypeVariablesSelector } from '../selectors';
import { Context, PrototypeStatus } from '../types';

const startPrototype = (diagramID?: string, blockID?: string | null): SyncThunk => (dispatch, getState) => {
  const state = getState();

  const projectID = activeProjectIDSelector(state);
  const variables = prototypeVariablesSelector(state);
  const activeDiagramID = activeDiagramIDSelector(state);

  localStorage.setItem(`TEST_VARIABLES_${projectID}`, JSON.stringify(variables));

  const context: Context = {
    stack: [
      {
        diagramID: diagramID || activeDiagramID,
        storage: {},
        variables: {},
        blockID,
      },
    ],
    turn: {},
    trace: [],
    storage: {},
    variables,
  };

  dispatch(updatePrototype({ status: PrototypeStatus.ACTIVE, context, startTime: Date.now() }));
};

export default startPrototype;
