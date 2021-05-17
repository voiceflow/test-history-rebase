import { Request, TraceType } from '@voiceflow/general-types';
import { TraceFrame as VisualTrace } from '@voiceflow/general-types/build/nodes/visual';
import cuid from 'cuid';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as Recent from '@/ducks/recent';
import * as Session from '@/ducks/session';
import { Trace } from '@/models';
import { Thunk } from '@/store/types';
import * as Sentry from '@/vendors/sentry';

import { pushContextHistory, pushPrototypeVisualDataHistory, updatePrototype, updatePrototypeContext } from '../actions';
import { prototypeContextSelector, prototypeSelector, prototypeVisualDataSelector } from '../selectors';
import { Context } from '../types';

const getTargetFlowID = (trace: Trace[]) => {
  for (let i = trace.length - 1; i >= 0; i--) {
    const currentTrace = trace[i];
    if (currentTrace.type === TraceType.FLOW && !!currentTrace.payload?.diagramID) {
      return currentTrace.payload.diagramID;
    }
  }
  return null;
};

const fetchContext = (request: Request | null): Thunk<Context | null> => async (dispatch, getState) => {
  const reduxState = getState();
  const { trace: _oldTrace, ...state } = prototypeContextSelector(reduxState);
  const { contextStep } = prototypeSelector(reduxState);
  const settings = Recent.recentPrototypeSelector(reduxState);
  const currentVisualData = prototypeVisualDataSelector(reduxState);
  const versionID = Session.activeVersionIDSelector(reduxState);
  const activeDiagramID = Session.activeDiagramIDSelector(reduxState);

  Errors.assertVersionID(versionID);
  Errors.assertDiagramID(activeDiagramID);

  try {
    const { state: _state, trace } = await client.prototype.interact(versionID, {
      state,
      request,
      config: { stopAll: !!settings.guided, excludeTypes: [], tts: true },
    });

    const newState: Context = _state;
    const lastVisual = [...trace].reverse().find(({ type }) => type === TraceType.VISUAL) as VisualTrace;

    newState.previousContextDiagramID = activeDiagramID;
    newState.targetContextDiagramID = getTargetFlowID(trace) || activeDiagramID;

    const newStateObj = {
      ...newState,
      trace: trace?.map((t) => ({ ...t, id: cuid() })) ?? [],
    };

    dispatch(updatePrototype({ contextStep: contextStep + 1 }));
    dispatch(updatePrototypeContext(newStateObj));
    dispatch(pushContextHistory(newStateObj));
    dispatch(pushPrototypeVisualDataHistory(lastVisual ? lastVisual.payload : currentVisualData));

    return newStateObj;
  } catch (err) {
    Sentry.error(err);

    return null;
  }
};

export default fetchContext;
