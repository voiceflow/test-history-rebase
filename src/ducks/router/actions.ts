import { CALL_HISTORY_METHOD, push } from 'connected-react-router';

import { ProductRoute, ProjectRoute, RootRoute, ToolsRoute } from '@/config/routes';
import { PlatformType } from '@/constants';
import { Action } from '@/store/types';

export type RouterAction = Action<typeof CALL_HISTORY_METHOD, unknown>;

export const goTo = (path: string, state = null) => push(`/${path}`, state) as RouterAction;

export const goToHome = () => goTo('');

export const goToLogin = () => goTo(RootRoute.LOGIN);

export const goToWorkspace = (workspaceId: string) => goTo(`${RootRoute.WORKSPACE}/${workspaceId}`);

export const goToDashboard = () => goTo(RootRoute.DASHBOARD);

export const goToDashboardWithSearch = (search: string) => goTo(`${RootRoute.DASHBOARD}${search}`);

export const goToOnboarding = () => goTo(`${RootRoute.ONBOARDING}${window.location.search}`);

export const goToPrototype = (versionID: string) => goTo(`${RootRoute.PROJECT}/${versionID}/${ProjectRoute.PROTOTYPE}`);

export const goToPublish = (versionID: string, platform: PlatformType) =>
  goTo(`${RootRoute.PROJECT}/${versionID}/${ProjectRoute.PUBLISH}${platform ? `/${platform}` : ''}`);

export const goToProducts = (versionID: string) => goTo(`${RootRoute.PROJECT}/${versionID}/${ProjectRoute.TOOLS}/${ToolsRoute.PRODUCTS}`);

export const goToNewProduct = (versionID: string) =>
  goTo(`${RootRoute.PROJECT}/${versionID}/${ProjectRoute.TOOLS}/${ToolsRoute.PRODUCT}/${ProductRoute.NEW}`);

export const goToEditProduct = (versionID: string, productID: string) =>
  goTo(`${RootRoute.PROJECT}/${versionID}/${ProjectRoute.TOOLS}/${ToolsRoute.PRODUCT}/${productID}`);
