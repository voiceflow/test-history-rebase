import { push } from 'connected-react-router';

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

export const goToCanvas = (skillID, diagramID) => goTo(`canvas/${skillID}${diagramID ? `/${diagramID}` : ''}`);

export const goToTestDiagram = (skillID) => goTo(`test/${skillID}`);

export const goToPublish = (skillID, platform) => goTo(`publish/${skillID}${platform ? `/${platform}` : ''}`);

export const goToCurrentCanvas = () => async (dispatch, getState) => {
  const skillID = activeSkillIDSelector(getState());
  const diagramID = activeDiagramIDSelector(getState());
  dispatch(goToCanvas(skillID, diagramID));
};

export const goToRootDiagram = () => async (dispatch, getState) => {
  const skill = activeSkillSelector(getState());

  dispatch(goToCanvas(skill.id, skill.rootDiagramID));
};

export const goToDiagram = (diagramID) => async (dispatch, getState) => {
  const skillID = activeSkillIDSelector(getState());

  dispatch(goToCanvas(skillID, diagramID));
};

export const goToProducts = (skillID) => goTo(`tools/${skillID}/products`);

export const goToNewProduct = (skillID) => goTo(`tools/${skillID}/product/new`);

export const goToEditProduct = (skillID, productID) => goTo(`tools/${skillID}/product/${productID}`);

export const goToDisplays = (skillID) => goTo(`visuals/${skillID}`);

export const goToNewDisplay = (skillID) => goTo(`visuals/${skillID}/display/new`);

export const goToDisplay = (skillID, displayID) => goTo(`visuals/${skillID}/display/${displayID}`);

export const goToDesigner = () => goTo('designer/preview');
