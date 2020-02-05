import { push } from 'connected-react-router';

import { RootRoutes } from '@/utils/routes';

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
