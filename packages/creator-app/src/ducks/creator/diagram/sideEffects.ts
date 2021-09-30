import { DiagramType } from '@voiceflow/api-sdk';
import { Adapters } from '@voiceflow/realtime-sdk';
import { batch } from 'react-redux';
import * as ReduxUndo from 'redux-undo';

import client from '@/client';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import { BlockType, DiagramState } from '@/constants';
import * as DiagramActions from '@/ducks/diagram/actions';
import * as DiagramSelectors from '@/ducks/diagram/selectors';
import * as Feature from '@/ducks/feature';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as Viewport from '@/ducks/viewport';
import mutableStore from '@/store/mutable';
import { Dispatchable, Thunk } from '@/store/types';

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

export const initializeCreatorForDiagram =
  (diagramID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const platform = ProjectV2.active.platformSelector(state);
    const diagramType = DiagramSelectors.activeDiagramTypeSelector(state);
    const isTopicsAndComponents = Feature.isFeatureEnabledSelector(state)(FeatureFlag.TOPICS_AND_COMPONENTS);

    const { diagram: dbDiagram, timestamp } = await client.api.diagram.getRTC(diagramID);

    const { offsetX: x, offsetY: y, zoom, variables } = dbDiagram;

    const creator = Adapters.creatorAdapter.fromDB(dbDiagram, { platform, context: {} });

    const getIntentStepIDs = () => creator.nodes.filter((node) => node.type === BlockType.INTENT).map((node) => node.id);

    mutableStore.setLastRealtimeTimestamp(timestamp);

    batch(() => {
      dispatch(ReduxUndo.ActionCreators.clearHistory());
      dispatch(DiagramActions.replaceLocalVariables(diagramID, variables));
      dispatch(Viewport.rehydrateViewport(diagramID, { x, y, zoom }));
      dispatch(initializeCreator(creator));
      dispatch(saveHistory());

      if (isTopicsAndComponents && diagramType === DiagramType.TOPIC && !dbDiagram.intentStepIDs?.length) {
        dispatch(DiagramActions.replaceIntentStepIDs(diagramID, getIntentStepIDs()));
      }
    });
  };

// active diagram

export const initializeCreatorForActiveDiagram = (): Thunk => async (dispatch, getState) => {
  const diagramID = Session.activeDiagramIDSelector(getState());

  Errors.assertDiagramID(diagramID);

  await dispatch(initializeCreatorForDiagram(diagramID));
};
