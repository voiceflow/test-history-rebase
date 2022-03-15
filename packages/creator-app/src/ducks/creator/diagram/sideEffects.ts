import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Adapters } from '@voiceflow/realtime-sdk';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import { batch } from 'react-redux';
import * as ReduxUndo from 'redux-undo';

import client from '@/client';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import { DiagramState } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramSelectorsV2 from '@/ducks/diagramV2/selectors';
import * as Feature from '@/ducks/feature';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as Viewport from '@/ducks/viewport';
import mutableStore from '@/store/mutable';
import { Dispatchable, SyncThunk, Thunk } from '@/store/types';

import { initializeCreator } from '../actions';
import { log } from '../constants';
import { saveHistory, setDiagramState } from './actions';

export const performSave =
  (save: Dispatchable): Thunk =>
  async (dispatch) => {
    try {
      dispatch(setDiagramState(DiagramState.SAVING));

      await dispatch(save);

      dispatch(setDiagramState(DiagramState.SAVED));
    } catch (err) {
      dispatch(setDiagramState(DiagramState.CHANGED));

      log.warn('failed to save diagram', err);
    }
  };

export const validateTopicAvailability = (): SyncThunk => (_dispatch, getState) => {
  const state = getState();

  // remove after FF removal
  const isTopicsAndComponentsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.TOPICS_AND_COMPONENTS);
  const isTopicsAndComponentsVersion = ProjectV2.active.isTopicsAndComponentsVersionSelector(state);

  if (!isTopicsAndComponentsEnabled || !isTopicsAndComponentsVersion) {
    return;
  }

  const diagramType = DiagramSelectorsV2.active.typeSelector(state);
  const isRootDiagramActive = CreatorV2.isRootDiagramActiveSelector(state);

  if (isRootDiagramActive || diagramType !== BaseModels.Diagram.DiagramType.TOPIC) {
    return;
  }

  const allNodeData = CreatorV2.allNodeDataSelector(state);

  const isTopicAvailable = allNodeData.some((nodeData) => {
    if (!Realtime.Utils.node.isIntentNode(nodeData)) return false;

    const { intent, availability } = nodeData;

    return !!intent && (!availability || availability === BaseNode.Intent.IntentAvailability.GLOBAL);
  });

  if (!isTopicAvailable) {
    toast.warn('This topic contains no intents that can be triggered from other topics.');
  }
};

const initializeCreatorForDiagram =
  (diagramID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const platform = ProjectV2.active.platformV2Selector(state);
    const projectType = ProjectV2.active.typeV2Selector(state);

    const { diagram: dbDiagram, timestamp } = await client.api.diagram.getRTC(diagramID);

    const { offsetX: x, offsetY: y, zoom } = dbDiagram;

    const creator = Adapters.creatorAdapter.fromDB(dbDiagram, { platform, projectType, context: {} });

    mutableStore.setLastRealtimeTimestamp(timestamp);

    batch(() => {
      dispatch(ReduxUndo.ActionCreators.clearHistory());
      dispatch(Viewport.rehydrateViewport(diagramID, { x, y, zoom }));
      dispatch(initializeCreator(creator));
      dispatch(saveHistory());
    });
  };

// active diagram

/**
 * @deprecated
 */
export const initializeCreatorForActiveDiagram = (): Thunk => async (dispatch, getState) => {
  const diagramID = Session.activeDiagramIDSelector(getState());

  Errors.assertDiagramID(diagramID);

  await dispatch(initializeCreatorForDiagram(diagramID));
};
