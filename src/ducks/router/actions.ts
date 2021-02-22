import { CALL_HISTORY_METHOD, push, replace } from 'connected-react-router';
import { generatePath } from 'react-router-dom';

import { Path, RootRoute } from '@/config/routes';
import { PlatformType } from '@/constants';
import { Action } from '@/store/types';
import * as Query from '@/utils/query';

export type RouterAction = Action<typeof CALL_HISTORY_METHOD, unknown>;

export const goTo = (path: string, state = null) => push(path.startsWith('/') ? path : `/${path}`, state) as RouterAction;

export const redirectTo = (path: string, state = null) => replace(path.startsWith('/') ? path : `/${path}`, state) as RouterAction;

export const goToHome = () => goTo('');

export const goToLogin = () => goTo(RootRoute.LOGIN);

export const goToWorkspace = (workspaceID?: string) => goTo(generatePath(Path.WORKSPACE_DASHBOARD, { workspaceID }));

export const goToDashboard = () => goTo(RootRoute.DASHBOARD);

export const goToDashboardWithSearch = (search: string) => goTo(`${RootRoute.DASHBOARD}${search}`);

export const goToOnboarding = () => goTo(`${RootRoute.ONBOARDING}${window.location.search}`);

export const goToPrototype = (versionID: string, nodeID?: string) =>
  goTo(`${generatePath(Path.PROJECT_PROTOTYPE, { versionID })}${nodeID ? Query.stringify({ nodeID }) : ''}`);

export const goToSettings = (versionID: string) => goTo(generatePath(Path.PROJECT_SETTINGS, { versionID }));

export const goToPublish = (versionID: string, platform: PlatformType) =>
  goTo(`${generatePath(Path.PROJECT_PUBLISH, { versionID })}${platform ? `/${platform}` : ''}`);

export const goToProducts = (versionID: string) => goTo(generatePath(Path.PRODUCT_LIST, { versionID }));

export const goToNewProduct = (versionID: string) => goTo(generatePath(Path.PRODUCT_DETAILS, { versionID, id: 'new' }));

export const goToEditProduct = (versionID: string, productID: string) => goTo(generatePath(Path.PRODUCT_DETAILS, { versionID, id: productID }));

export const goToInteractionModel = (versionID: string, diagramID: string, modelType?: string, entityID?: string) =>
  goTo(`${generatePath(Path.CANVAS_MODEL, { versionID, diagramID, modelType, entityID })}`);

export const goToCanvasCommenting = (versionID: string, diagramID: string, search = window.location.search) =>
  goTo(`${generatePath(Path.CANVAS_COMMENTING, { versionID, diagramID })}${search}`);

export const redirectToCanvasCommenting = (versionID: string, diagramID: string) =>
  redirectTo(generatePath(Path.CANVAS_COMMENTING, { versionID, diagramID }));
