import client from '@/client';
import * as Modal from '@/ducks/modal';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import { RootRoutes } from '@/utils/routes';

import { goTo } from './actions';

export const goToCanvas = (versionID, diagramID, isNewDiagram) => async (dispatch, getState) => {
  const state = getState();
  const isRealtimeConnected = Realtime.isRealtimeConnectedSelector(state);
  const realtimeDiagramID = Realtime.realtimeDiagramIDSelector(state);

  // switch the realtime connection to a new diagram
  if (isRealtimeConnected && realtimeDiagramID !== diagramID) {
    try {
      const locks = isNewDiagram
        ? await client.socket.realtime.initialize(versionID, diagramID)
        : await client.socket.realtime.switch(versionID, diagramID);

      dispatch(Realtime.initializeRealtime(diagramID, locks));
    } catch {
      dispatch(Modal.setError('Error Switching Flows'));
    }
  }

  dispatch(goTo(`${RootRoutes.PROJECT}/${versionID}${diagramID ? `/canvas/${diagramID}` : ''}${window.location.search}`));
};

export const goToCurrentCanvas = () => async (dispatch, getState) => {
  const state = getState();
  const versionID = Skill.activeSkillIDSelector(state);
  const diagramID = Skill.activeDiagramIDSelector(state);

  dispatch(goToCanvas(versionID, diagramID));
};

export const goToRootDiagram = () => async (dispatch, getState) => {
  const skill = Skill.activeSkillSelector(getState());

  dispatch(goToCanvas(skill.id, skill.rootDiagramID));
};

export const goToDiagram = (diagramID) => async (dispatch, getState) => {
  const versionID = Skill.activeSkillIDSelector(getState());

  dispatch(goToCanvas(versionID, diagramID));
};
