import { Utils } from '@voiceflow/common';

import { ControlScheme, ZoomType } from '@/components/Canvas/constants';

import { STATE_KEY } from './ui.state';

const uiType = Utils.protocol.typeFactory(STATE_KEY);

export const SetZoomType = Utils.protocol.createAction<ZoomType>(uiType('SET_ZOOM_TYPE'));
export const SetCanvasNavigation = Utils.protocol.createAction<ControlScheme>(uiType('SET_CANVAS_NAVIGATION'));

export const ToggleCanvasOnly = Utils.protocol.createAction(uiType('TOGGLE_CANVAS_ONLY'));
export const ToggleCanvasGrid = Utils.protocol.createAction(uiType('TOGGLE_CANVAS_GRID'));
export const ToggleCanvasSidebar = Utils.protocol.createAction(uiType('TOGGLE_CANVAS_SIDEBAR'));
export const ToggleCommentVisibility = Utils.protocol.createAction(uiType('TOGGLE_COMMENT_VISIBILITY'));
export const ToggleWorkflowThreadsOnly = Utils.protocol.createAction(uiType('TOGGLE_WORKFLOW_THREADS_ONLY'));
export const ToggleMentionedThreadsOnly = Utils.protocol.createAction(uiType('TOGGLE_MENTIONED_THREADS_ONLY'));

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const ToggleDomainThreadsOnly = Utils.protocol.createAction(uiType('TOGGLE_DOMAIN_THREADS_ONLY'));
