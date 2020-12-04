import cuid from 'cuid';

import client from '@/client';
import { FeatureFlag } from '@/config/features';
import { TraceType } from '@/constants/prototype';
import * as Feature from '@/ducks/feature';
import * as Skill from '@/ducks/skill';
import { StateRequest, Trace } from '@/models';
import { Thunk } from '@/store/types';

import { pushContextHistory, updatePrototype, updatePrototypeContext } from '../actions';
import { prototypeContextSelector, prototypeSelector } from '../selectors';
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

const fetchContext = (request?: StateRequest): Thunk<Context | null> => async (dispatch, getState) => {
  const state = getState();
  const { trace, ...context } = prototypeContextSelector(state);
  const { contextStep } = prototypeSelector(state);
  const currentDiagramID = Skill.activeDiagramIDSelector(state);
  const [locale] = Skill.activeLocalesSelector(state);
  const isGeneralPrototypeEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.GENERAL_PROTOTYPE);

  try {
    const interact = isGeneralPrototypeEnabled ? client.prototype.interactV2 : client.prototype.interact;

    const newContext: Context = await interact({ state: context, request }, locale);

    newContext.previousContextDiagramID = currentDiagramID;
    newContext.targetContextDiagramID = getTargetFlowID(newContext.trace) || currentDiagramID;

    dispatch(updatePrototype({ contextStep: contextStep + 1 }));
    dispatch(updatePrototypeContext(newContext));
    dispatch(pushContextHistory(newContext));

    return {
      ...newContext,
      trace: newContext.trace?.map((trace) => ({ ...trace, id: cuid() })) ?? [],
    };
  } catch (err) {
    log.error(err);

    return null;
  }
};

export default fetchContext;
