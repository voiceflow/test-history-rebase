import { Request, TraceType } from '@voiceflow/general-types';
import { TraceFrame as VisualTrace } from '@voiceflow/general-types/build/nodes/visual';
import cuid from 'cuid';

import client from '@/client';
import * as Skill from '@/ducks/skill';
import { Trace } from '@/models';
import { Thunk } from '@/store/types';

import { pushContextHistory, pushPrototypeVisualDataHistory, updatePrototype, updatePrototypeContext } from '../actions';
import { prototypeContextSelector, prototypeSelector, prototypeVisualDataSelector } from '../selectors';
import { Context } from '../types';
import { log } from '../utils';

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
  const currentVisualData = prototypeVisualDataSelector(reduxState);
  const versionID = Skill.activeSkillIDSelector(reduxState);
  const currentDiagramID = Skill.activeDiagramIDSelector(reduxState);

  try {
    const { state: _state, trace } = await client.prototype.interact(versionID, { state, request });

    const newState: Context = _state;
    const lastVisual = [...trace].reverse().find(({ type }) => type === TraceType.VISUAL) as VisualTrace;

    newState.previousContextDiagramID = currentDiagramID;
    newState.targetContextDiagramID = getTargetFlowID(trace) || currentDiagramID;

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
    log.error(err);

    return null;
  }
};

export default fetchContext;
