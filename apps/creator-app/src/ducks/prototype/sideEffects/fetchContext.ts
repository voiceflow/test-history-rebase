import { BaseNode, BaseRequest, BaseTrace } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as Recent from '@/ducks/recent';
import * as Session from '@/ducks/session';
import { Trace } from '@/models';
import { Thunk } from '@/store/types';

import { pushContextHistory, pushPrototypeVisualDataHistory, updatePrototype, updatePrototypeContext } from '../actions';
import { prototypeContextSelector, prototypeSelector, prototypeSessionIDSelector, prototypeVisualDataSelector } from '../selectors';
import { Context } from '../types';

const getProjectExcludedTraceTypes = Realtime.Utils.platform.createProjectTypeSelector({
  [Platform.Constants.ProjectType.CHAT]: [BaseTrace.TraceType.SPEAK],
  [Platform.Constants.ProjectType.VOICE]: [],
});

const getTargetFlowID = (trace: Trace[]) => {
  for (let i = trace.length - 1; i >= 0; i--) {
    const currentTrace = trace[i];
    if (currentTrace.type === BaseTrace.TraceType.FLOW && !!currentTrace.payload?.diagramID) {
      return currentTrace.payload.diagramID;
    }
  }
  return null;
};

const fetchContext =
  (request: BaseRequest.BaseRequest | null, config: Recent.PrototypeConfig, { isPublic }: { isPublic?: boolean } = {}): Thunk<Context | null> =>
  async (dispatch, getState) => {
    const reduxState = getState();
    const { trace: _oldTrace, ...state } = prototypeContextSelector(reduxState);
    const { contextStep } = prototypeSelector(reduxState);
    const currentVisualData = prototypeVisualDataSelector(reduxState);
    const versionID = Session.activeVersionIDSelector(reduxState);
    const activeDiagramID = Session.activeDiagramIDSelector(reduxState);
    // unique identifier for session analytics
    const sessionID = prototypeSessionIDSelector(reduxState);

    Errors.assertVersionID(versionID);
    Errors.assertDiagramID(activeDiagramID);

    const guidedConfig = { stopAll: true, stopTypes: [BaseNode.NodeType.IF_V2] };

    try {
      const { state: _state, trace } = await client.prototype.interact(
        versionID,
        {
          state,
          request,
          config: { ...(!!config.isGuided && guidedConfig), excludeTypes: getProjectExcludedTraceTypes(config.projectType), tts: true },
        },
        { sessionID, platform: isPublic ? 'prototype' : 'canvas-prototype' }
      );

      const newState: Context = _state;

      // TODO: add trace typeguards to libs
      const lastVisual = [...trace].reverse().find(({ type }) => type === BaseTrace.TraceType.VISUAL) as BaseNode.Visual.TraceFrame;

      newState.previousContextDiagramID = activeDiagramID;
      newState.targetContextDiagramID = getTargetFlowID(trace) || activeDiagramID;

      const newStateObj = {
        ...newState,
        trace: trace?.map((t) => ({ ...t, id: Utils.id.cuid() })) ?? [],
      };

      dispatch(updatePrototype({ contextStep: contextStep + 1 }));
      dispatch(updatePrototypeContext(newStateObj));
      dispatch(pushContextHistory(newStateObj));
      dispatch(pushPrototypeVisualDataHistory(lastVisual ? lastVisual.payload : currentVisualData));

      return newStateObj;
    } catch (error) {
      client.log.error(error);
      return null;
    }
  };

export default fetchContext;
