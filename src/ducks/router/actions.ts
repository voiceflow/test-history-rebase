import { CALL_HISTORY_METHOD, push } from 'connected-react-router';

import { PlatformType } from '@/constants';
import { Action } from '@/store/types';
import { RootRoutes } from '@/utils/routes';

export type RouterAction = Action<typeof CALL_HISTORY_METHOD, unknown>;

export const goTo = (path: string, state = null) => push(`/${path}`, state) as RouterAction;

export const goToHome = () => goTo('');

export const goToLogin = () => goTo('login');

export const goToDashboard = () => goTo('dashboard');

export const goToDashboardWithSearch = (search: string) => goTo(`dashboard${search}`);

export const goToOnboarding = () => goTo(`onboarding${window.location.search}`);

export const goToTeam = (teamID: string) => goTo(`team/${teamID}`);

export const goToNewTeamFlow = () => goTo('team/new');

export const gotToNewProjectFlow = (boardID: string) => goTo(`team/template/${boardID}`);

export const goToTestDiagram = (versionID: string) => goTo(`${RootRoutes.PROJECT}/${versionID}/test`);

export const goToPublish = (versionID: string, platform: PlatformType) =>
  goTo(`${RootRoutes.PROJECT}/${versionID}/publish${platform ? `/${platform}` : ''}`);

export const goToProducts = (versionID: string) => goTo(`${RootRoutes.PROJECT}/${versionID}/tools/products`);

export const goToNewProduct = (versionID: string) => goTo(`${RootRoutes.PROJECT}/${versionID}/tools/product/new`);

export const goToEditProduct = (versionID: string, productID: string) => goTo(`${RootRoutes.PROJECT}/${versionID}/tools/product/${productID}`);
