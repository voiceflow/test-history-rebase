import { activeDiagramIDSelector, activeProjectIDSelector } from '@/ducks/skill';
import { SyncThunk } from '@/store/types';

import { updateTesting } from '../actions';
import { testingVariablesSelector } from '../selectors';
import { Context, TestStatus } from '../types';

const startTest = (diagramID?: string, blockID?: string | null): SyncThunk => (dispatch, getState) => {
  const state = getState();

  const projectID = activeProjectIDSelector(state);
  const variables = testingVariablesSelector(state);
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

  dispatch(updateTesting({ status: TestStatus.ACTIVE, context, startTime: Date.now() }));
};

export default startTest;
