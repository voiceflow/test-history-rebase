import { Node, Request } from '@voiceflow/base-types';
import { TraceType } from '@voiceflow/base-types/build/common/trace';
import { Utils } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';
import { batch } from 'react-redux';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as Recent from '@/ducks/recent';
import * as Session from '@/ducks/session';
import { Trace } from '@/models';
import { Thunk } from '@/store/types';
import { createPlatformSelector } from '@/utils/platform';
import { getPrototypeSessionID } from '@/utils/prototype';
import * as Sentry from '@/vendors/sentry';

import { pushContextHistory, pushPrototypeVisualDataHistory, updatePrototype, updatePrototypeContext } from '../actions';
import { prototypeContextSelector, prototypeIDSelector, prototypeSelector, prototypeVisualDataSelector } from '../selectors';
import { Context } from '../types';

const getPlatformExcludedTraceTypes = createPlatformSelector(
  {
    [Constants.PlatformType.CHATBOT]: [TraceType.SPEAK],
    [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: [TraceType.SPEAK],
  },
  []
);

const getTargetFlowID = (trace: Trace[]) => {
  for (let i = trace.length - 1; i >= 0; i--) {
    const currentTrace = trace[i];
    if (currentTrace.type === Node.Utils.TraceType.FLOW && !!currentTrace.payload?.diagramID) {
      return currentTrace.payload.diagramID;
    }
  }
  return null;
};

const fetchContext =
  (request: Request.BaseRequest | null, config: Recent.PrototypeConfig): Thunk<Context | null> =>
  async (dispatch, getState) => {
    const reduxState = getState();
    const { trace: _oldTrace, ...state } = prototypeContextSelector(reduxState);
    const { contextStep } = prototypeSelector(reduxState);
    const currentVisualData = prototypeVisualDataSelector(reduxState);
    const versionID = Session.activeVersionIDSelector(reduxState);
    const activeDiagramID = Session.activeDiagramIDSelector(reduxState);
    const prototypeID = prototypeIDSelector(reduxState) || Utils.id.cuid();

    // unique identifier for session analytics
    const sessionID = getPrototypeSessionID(versionID, prototypeID);

    Errors.assertVersionID(versionID);
    Errors.assertDiagramID(activeDiagramID);

    const guidedConfig = { stopAll: true, stopTypes: [Node.NodeType.IF_V2] };

    try {
      const { state: _state, trace } = await client.prototype.interact(
        versionID,
        {
          state,
          request,
          config: { ...(!!config.isGuided && guidedConfig), excludeTypes: getPlatformExcludedTraceTypes(config.platform), tts: true },
        },
        sessionID
      );

      const newState: Context = _state;
      const lastVisual = [...trace].reverse().find(({ type }) => type === Node.Utils.TraceType.VISUAL) as Node.Visual.TraceFrame;

      newState.previousContextDiagramID = activeDiagramID;
      newState.targetContextDiagramID = getTargetFlowID(trace) || activeDiagramID;

      const newStateObj = {
        ...newState,
        trace: trace?.map((t) => ({ ...t, id: Utils.id.cuid() })) ?? [],
      };

      batch(() => {
        dispatch(updatePrototype({ ID: prototypeID, contextStep: contextStep + 1 }));
        dispatch(updatePrototypeContext(newStateObj));
        dispatch(pushContextHistory(newStateObj));
        dispatch(pushPrototypeVisualDataHistory(lastVisual ? lastVisual.payload : currentVisualData));
      });

      return newStateObj;
    } catch (err) {
      Sentry.error(err);

      return null;
    }
  };

export default fetchContext;
