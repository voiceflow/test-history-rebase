import * as Errors from '@/config/errors';
import { PrototypeStatus } from '@/constants/prototype';
import * as Session from '@/ducks/session';
import { SyncThunk } from '@/store/types';

import { pushContextHistory, pushPrototypeVisualDataHistory, updatePrototype } from '../actions';
import { prototypeSelectedPersonaID } from '../selectors';
import { Context, PrototypeSettings } from '../types';

const startPublicPrototype =
  (settings: PrototypeSettings): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const activeDiagramID = Session.activeDiagramIDSelector(state);
    const selectedPersonaID = prototypeSelectedPersonaID(state);

    const persona = selectedPersonaID ? settings.variableStates.find(({ id }) => id === selectedPersonaID) : undefined;
    const nodeID = persona?.startFrom?.stepID ?? null;
    const programID = persona?.startFrom?.diagramID ?? null;

    Errors.assertDiagramID(activeDiagramID);

    const stack = programID
      ? [
          {
            programID,
            nodeID,
            storage: {},
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
        flowIDHistory: programID ? [programID] : [],
      })
    );
  };
export default startPublicPrototype;
