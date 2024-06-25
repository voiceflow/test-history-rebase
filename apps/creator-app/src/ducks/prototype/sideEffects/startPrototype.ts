import { PrototypeStatus } from '@/constants/prototype';
import {
  selectedStartFromDiagramIDSelector,
  selectedStartFromNodeIDSelector,
  selectedVariablesSelector,
} from '@/ducks/variableState/selectors';
import type { SyncThunk } from '@/store/types';

import { pushContextHistory, pushPrototypeVisualDataHistory, updatePrototype } from '../actions';
import type { Context } from '../types';

const startPrototype = (): SyncThunk => (dispatch, getState) => {
  const state = getState();

  const nodeID = selectedStartFromNodeIDSelector(state);
  const selectedDiagramID = selectedStartFromDiagramIDSelector(state);
  const variables = selectedVariablesSelector(state) || {};

  const stack = selectedDiagramID
    ? [
        {
          programID: selectedDiagramID,
          diagramID: selectedDiagramID,
          storage: {},
          variables: {},
          nodeID: nodeID ?? undefined,
        },
      ]
    : undefined;

  const flowIDHistory = selectedDiagramID ? [selectedDiagramID] : [];

  const context: Context = {
    stack,
    turn: {},
    trace: [],
    storage: {},
    variables,
  };

  dispatch(pushContextHistory(context));
  dispatch(pushPrototypeVisualDataHistory(null));
  dispatch(updatePrototype({ status: PrototypeStatus.ACTIVE, context, startTime: Date.now(), flowIDHistory }));
};
export default startPrototype;
