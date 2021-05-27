import { batch } from 'react-redux';
import * as ReduxUndo from 'redux-undo';

import client from '@/client';
import creatorAdapter from '@/client/adapters/creator';
import * as Errors from '@/config/errors';
import { DiagramState } from '@/constants';
import * as Diagram from '@/ducks/diagram/actions';
import * as Features from '@/ducks/feature';
import * as Project from '@/ducks/project';
import * as Session from '@/ducks/session';
import * as Viewport from '@/ducks/viewport';
import mutableStore from '@/store/mutable';
import { Dispatchable, Thunk } from '@/store/types';

import { initializeCreator } from '../actions';
import { log } from '../constants';
import { saveHistory, setDiagramState } from './actions';

export const performSave = (save: Dispatchable): Thunk => async (dispatch) => {
  try {
    dispatch(setDiagramState(DiagramState.SAVING));

    await dispatch(save);

    dispatch(setDiagramState(DiagramState.SAVED));
  } catch (err) {
    dispatch(setDiagramState(DiagramState.CHANGED));

    log.warn('failed to save diagram', err);
  }
};

export const initializeCreatorForDiagram = (diagramID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const platform = Project.activePlatformSelector(state);
  const features = Features.allActiveFeaturesSelector(state);

  const { diagram: DBDiagram, timestamp } = await client.api.diagram.getRTC(diagramID);

  const { offsetX: x, offsetY: y, zoom, variables } = DBDiagram;

  const creator = creatorAdapter.fromDB(DBDiagram, { platform, features });

  mutableStore.setLastRealtimeTimestamp(timestamp);

  batch(() => {
    dispatch(ReduxUndo.ActionCreators.clearHistory());
    dispatch(Diagram.replaceLocalVariables(diagramID, variables));
    dispatch(Viewport.rehydrateViewport(diagramID, { x, y, zoom }));
    dispatch(initializeCreator(creator));
    dispatch(saveHistory());
  });
};

// active diagram

export const initializeCreatorForActiveDiagram = (): Thunk => async (dispatch, getState) => {
  const diagramID = Session.activeDiagramIDSelector(getState());

  Errors.assertDiagramID(diagramID);

  await dispatch(initializeCreatorForDiagram(diagramID));
};
