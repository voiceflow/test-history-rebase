import { createSelector } from 'reselect';

import { createRootSelector } from '../utils';
import { STATE_KEY } from './ui.state';

const rootSelector = createRootSelector(STATE_KEY);

export const zoomType = createSelector(rootSelector, ({ zoomType }) => zoomType);
export const isCanvasOnly = createSelector(rootSelector, ({ canvasOnly }) => canvasOnly);
export const isCanvasGrid = createSelector(rootSelector, ({ canvasGrid }) => canvasGrid);
export const canvasSidebar = createSelector(rootSelector, ({ canvasSidebar }) => canvasSidebar);
export const canvasNavigation = createSelector(rootSelector, ({ canvasNavigation }) => canvasNavigation);
export const isCommentsVisible = createSelector(rootSelector, ({ commentsVisible }) => commentsVisible);
export const canvasSidebarWidth = createSelector(canvasSidebar, (canvasSidebar) => canvasSidebar?.width);
export const canvasSidebarVisible = createSelector(canvasSidebar, (canvasSidebar) => canvasSidebar?.visible ?? true);
export const isWorkflowThreadsOnly = createSelector(
  rootSelector,
  ({ topicThreadsOnly, workflowThreadsOnly }) => workflowThreadsOnly ?? topicThreadsOnly
);
export const isMentionedThreadsOnly = createSelector(rootSelector, ({ mentionedThreadsOnly }) => mentionedThreadsOnly);

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const isDomainThreadsOnly = createSelector(rootSelector, ({ domainThreadsOnly }) => domainThreadsOnly);
