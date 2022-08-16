import { Adapters } from '@voiceflow/realtime-sdk';
import * as Realtime from '@voiceflow/realtime-sdk';
import { batch } from 'react-redux';
import * as ReduxUndo from 'redux-undo';

import client from '@/client';
import * as Errors from '@/config/errors';
import { DiagramState } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
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

const initializeCreatorForDiagram =
  (diagramID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const platform = ProjectV2.active.platformSelector(state);
    const projectType = ProjectV2.active.projectTypeSelector(state);

    const { diagram: dbDiagram, timestamp } = await client.api.diagram.getRTC(diagramID);

    const { offsetX: x, offsetY: y, zoom } = dbDiagram;

    const creator = Adapters.creatorAdapter.fromDB(dbDiagram, { platform, projectType, context: {} });

    mutableStore.setLastRealtimeTimestamp(timestamp);

    batch(() => {
      dispatch(ReduxUndo.ActionCreators.clearHistory());
      dispatch(Realtime.diagram.viewport.rehydrate({ viewport: { id: diagramID, x, y, zoom } }));
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
