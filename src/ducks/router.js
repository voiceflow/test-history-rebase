import { push } from 'connected-react-router';

import client from '@/client';
import { RootRoutes } from '@/utils/routes';

import * as Modal from './modal';
import * as Realtime from './realtime';
import * as Skill from './skill';

export const STATE_KEY = 'router';

// action creators

export const goTo = (path, state = null) => push(`/${path}`, state);

export const goToHome = () => goTo('');

export const goToLogin = () => goTo('login');

export const goToDashboard = () => goTo('dashboard');

export const goToDashboardWithSearch = (search) => goTo(`dashboard${search}`);

export const goToOnboarding = () => goTo(`onboarding${window.location.search}`);

export const goToTeam = (teamID) => goTo(`team/${teamID}`);

export const goToNewTeamFlow = () => goTo('team/new');

export const gotToNewProjectFlow = (boardID) => goTo(`team/template/${boardID}`);

export const goToTestDiagram = (versionID) => goTo(`${RootRoutes.PROJECT}/${versionID}/test`);

export const goToPublish = (versionID, platform) => goTo(`${RootRoutes.PROJECT}/${versionID}/publish${platform ? `/${platform}` : ''}`);

export const goToProducts = (versionID) => goTo(`${RootRoutes.PROJECT}/${versionID}/tools/products`);

export const goToNewProduct = (versionID) => goTo(`${RootRoutes.PROJECT}/${versionID}/tools/product/new`);

export const goToEditProduct = (versionID, productID) => goTo(`${RootRoutes.PROJECT}/${versionID}/tools/product/${productID}`);

export const goToDisplays = (versionID) => goTo(`${RootRoutes.PROJECT}/${versionID}/visuals`);

export const goToNewDisplay = (versionID) => goTo(`${RootRoutes.PROJECT}/${versionID}/visuals/new`);

export const goToDisplay = (versionID, displayID) => goTo(`${RootRoutes.PROJECT}/${versionID}/visuals/${displayID}`);

export const goToDesigner = () => goTo('designer/preview');

// side effects

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
