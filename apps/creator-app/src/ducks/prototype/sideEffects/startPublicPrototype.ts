import { PrototypeStatus } from '@/constants/prototype';
import type { SyncThunk } from '@/store/types';

import { pushContextHistory, pushPrototypeVisualDataHistory, updatePrototype } from '../actions';
import { prototypeSelectedPersonaID } from '../selectors';
import type { Context, PrototypeSettings } from '../types';

const startPublicPrototype =
  (settings: PrototypeSettings): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const selectedPersonaID = prototypeSelectedPersonaID(state);

    const persona = selectedPersonaID ? settings.variableStates.find(({ id }) => id === selectedPersonaID) : undefined;
    const nodeID = persona?.startFrom?.stepID ?? null;
    const diagramID = persona?.startFrom?.diagramID ?? null;

    const stack = diagramID
      ? [
          {
            // TODO: remove when general runtime merged
            programID: diagramID,
            nodeID,
            storage: {},
            diagramID,
            variables: {},
          },
        ]
      : undefined;

    const context: Context = {
      stack,
      turn: {},
      trace: [],
      storage: {},
      variables: persona?.variables ?? {},
    };

    dispatch(pushContextHistory(context));
    dispatch(pushPrototypeVisualDataHistory(null));
    dispatch(
      updatePrototype({
        status: PrototypeStatus.ACTIVE,
        autoplay: false,
        context,
        startTime: Date.now(),
        flowIDHistory: diagramID ? [diagramID] : [],
      })
    );
  };
export default startPublicPrototype;
