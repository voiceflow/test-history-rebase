import { createSelector } from 'reselect';

import { createRootSelector } from '../utils';
import { STATE_KEY } from './constants';

const rootSelector = createRootSelector(STATE_KEY);

export const openBlockMenuSectionsSelector = createSelector(rootSelector, ({ blockMenu: { openSections } }) => openSections);

export const isCreatorMenuHiddenSelector = createSelector(rootSelector, ({ creatorMenu: { isHidden } }) => isHidden);

export const canvasNavigationSelector = createSelector(rootSelector, ({ canvasNavigation }) => canvasNavigation);

export const isCanvasGridEnabledSelector = createSelector(rootSelector, ({ canvasGrid }) => canvasGrid);

export const zoomTypeSelector = createSelector(rootSelector, ({ zoomType }) => zoomType);

export const isCanvasOnlyShowingSelector = createSelector(rootSelector, ({ canvasOnly }) => canvasOnly);

export const isFullScreenMode = createSelector(rootSelector, ({ fullScreenMode }) => fullScreenMode);

export const isLoadingProjectsSelector = createSelector(rootSelector, ({ isLoadingProjects }) => isLoadingProjects);

export const isCommentsVisible = createSelector(rootSelector, ({ commentsVisible }) => commentsVisible);

export const isMentionedThreadsOnly = createSelector(rootSelector, ({ mentionedThreadsOnly }) => mentionedThreadsOnly);
