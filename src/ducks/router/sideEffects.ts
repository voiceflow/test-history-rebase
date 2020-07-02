import client from '@/client';
import * as Modal from '@/ducks/modal';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import { Skill as SkillModel } from '@/models';
import { GetState, Thunk, ThunkDispatch } from '@/store/types';
import { RootRoutes } from '@/utils/routes';

import { goTo, goToPrototype, goToPublish } from './actions';

const switchRealtime = async (dispatch: ThunkDispatch, getState: GetState, versionID: string, diagramID: string, isNewDiagram?: boolean) => {
  const state = getState();
  const isRealtimeConnected = Realtime.isRealtimeConnectedSelector(state);
  const realtimeDiagramID = Realtime.realtimeDiagramIDSelector(state);

  // switch the realtime connection to a new diagram
  if (isRealtimeConnected && realtimeDiagramID !== diagramID) {
    try {
      const locks = isNewDiagram
        ? await client.socket!.realtime.initialize(versionID, diagramID)
        : await client.socket!.realtime.switch(versionID, diagramID);

      dispatch(Realtime.initializeRealtime(diagramID, locks));
    } catch {
      dispatch(Modal.setError('Error Switching Flows'));
    }
  }
};

export const goToCanvas = (versionID: string, diagramID: string, isNewDiagram?: boolean): Thunk => async (dispatch, getState) => {
  await switchRealtime(dispatch, getState, versionID, diagramID, isNewDiagram);

  dispatch(goTo(`${RootRoutes.PROJECT}/${versionID}${diagramID ? `/canvas/${diagramID}` : '/canvas'}${window.location.search}`));
};

export const goToCurrentCanvas = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Skill.activeSkillIDSelector(state);
  const diagramID = Skill.activeDiagramIDSelector(state);

  dispatch(goToCanvas(versionID, diagramID));
};

export const goToCurrentCanvasCommenting = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Skill.activeSkillIDSelector(state);
  const diagramID = Skill.activeDiagramIDSelector(state);

  await switchRealtime(dispatch, getState, versionID, diagramID);

  dispatch(goTo(`${RootRoutes.PROJECT}/${versionID}/canvas/${diagramID}/commenting${window.location.search}`));
};

export const goToRootDiagram = (): Thunk => async (dispatch, getState) => {
  const skill = Skill.activeSkillSelector(getState()) as SkillModel;

  dispatch(goToCanvas(skill.id, skill.rootDiagramID));
};

export const goToDiagram = (diagramID: string): Thunk => async (dispatch, getState) => {
  const versionID = Skill.activeSkillIDSelector(getState());

  dispatch(goToCanvas(versionID, diagramID));
};

export const goToCurrentPrototype = (): Thunk => async (dispatch, getState) => {
  const versionID = Skill.activeSkillIDSelector(getState());

  dispatch(goToPrototype(versionID));
};

export const goToActivePlatformPublish = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Skill.activeSkillIDSelector(state);
  const platform = Skill.activePlatformSelector(state);

  dispatch(goToPublish(versionID, platform));
};
