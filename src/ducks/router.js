import { push } from 'connected-react-router';

import { RootRoutes } from '@/utils/routes';

import { activeDiagramIDSelector, activeSkillIDSelector, activeSkillSelector } from './skill';

const goTo = (path, search) => push(`/${path}`, search && { search });

export const goToHome = () => goTo('');

export const goToLogin = () => goTo('login');

export const goToDashboard = () => goTo('dashboard');

export const goToDashboardWithSearch = (search) => goTo('dashboard', search);

export const goToOnboarding = () => goTo('onboarding');

export const goToTeam = (teamID) => goTo(`team/${teamID}`);

export const goToNewTeamFlow = () => goTo('team/new');

export const gotToNewProjectFlow = (boardID) => goTo(`team/template/${boardID}`);

export const goToCanvas = (versionID, diagramID) => goTo(`${RootRoutes.PROJECT}/${versionID}${diagramID ? `/canvas/${diagramID}` : ''}`);

export const goToTestDiagram = (versionID) => goTo(`${RootRoutes.PROJECT}/${versionID}/test`);

export const goToPublish = (versionID, platform) => goTo(`${RootRoutes.PROJECT}/${versionID}/publish${platform ? `/${platform}` : ''}`);

export const goToCurrentCanvas = () => async (dispatch, getState) => {
  const versionID = activeSkillIDSelector(getState());
  const diagramID = activeDiagramIDSelector(getState());
  dispatch(goToCanvas(versionID, diagramID));
};

export const goToRootDiagram = () => async (dispatch, getState) => {
  const skill = activeSkillSelector(getState());

  dispatch(goToCanvas(skill.id, skill.rootDiagramID));
};

export const goToDiagram = (diagramID) => async (dispatch, getState) => {
  const versionID = activeSkillIDSelector(getState());

  dispatch(goToCanvas(versionID, diagramID));
};

export const goToProducts = (versionID) => goTo(`${RootRoutes.PROJECT}/${versionID}/tools/products`);

export const goToNewProduct = (versionID) => goTo(`${RootRoutes.PROJECT}/${versionID}/tools/product/new`);

export const goToEditProduct = (versionID, productID) => goTo(`${RootRoutes.PROJECT}/${versionID}/tools/product/${productID}`);

export const goToDisplays = (versionID) => goTo(`${RootRoutes.PROJECT}/${versionID}/visuals`);

export const goToNewDisplay = (versionID) => goTo(`${RootRoutes.PROJECT}/${versionID}/visuals/new`);

export const goToDisplay = (versionID, displayID) => goTo(`${RootRoutes.PROJECT}/${versionID}/visuals/${displayID}`);

export const goToDesigner = () => goTo('designer/preview');
