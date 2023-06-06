import { Utils } from '@voiceflow/common';
import { persistReducer } from 'redux-persist';
import storageLocal from 'redux-persist/lib/storage';

import * as Session from '@/ducks/session';
import { Reducer, RootReducer } from '@/store/types';

import { AnyUIAction, SetCanvasNavigation, SetLoadingProjects, SetZoomType, ToggleBlockMenuSection, ToggleFullScreenMode, UIAction } from './actions';
import { INITIAL_STATE, STATE_KEY } from './constants';
import { UIState } from './types';

export * from './actions';
export * from './constants';
export * from './selectors';
export * from './types';

const PERSIST_CONFIG = {
  key: STATE_KEY,
  storage: storageLocal,
  blacklist: ['canvasOnly'],
};

// reducers

export const toggleBlockMenuSectionReducer: Reducer<UIState, ToggleBlockMenuSection> = (state, { payload: section }) => {
  const { openSections } = state.blockMenu;

  return {
    ...state,
    blockMenu: {
      ...state.blockMenu,
      openSections: openSections.includes(section) ? Utils.array.withoutValue(openSections, section) : [...openSections, section],
    },
  };
};

export const toggleCreatorMenuHiddenReducer: Reducer<UIState> = (state) => ({
  ...state,
  creatorMenu: {
    ...state.creatorMenu,
    isHidden: !state.creatorMenu.isHidden,
  },
});

export const hideCreatorMenuReducer: Reducer<UIState> = (state) => ({
  ...state,
  creatorMenu: {
    ...state.creatorMenu,
    isHidden: true,
  },
});

export const showCreatorMenuReducer: Reducer<UIState> = (state) => ({
  ...state,
  creatorMenu: {
    ...state.creatorMenu,
    isHidden: false,
  },
});

export const setNavigationReducer: Reducer<UIState, SetCanvasNavigation> = (state, { payload: canvasNavigation }) => ({
  ...state,
  canvasNavigation,
});

export const setZoomTypeReducer: Reducer<UIState, SetZoomType> = (state, { payload: zoomType }) => ({
  ...state,
  zoomType,
});

export const toggleCanvasOnlyReducer: Reducer<UIState> = (state) => ({
  ...state,
  canvasOnly: !state.canvasOnly,
});

export const toggleCanvasGridReducer: Reducer<UIState> = (state) => ({
  ...state,
  canvasGrid: !state.canvasGrid,
});

export const toggleFullScreenModeReducer: Reducer<UIState, ToggleFullScreenMode> = (state, { payload: value }) => ({
  ...state,
  canvasOnly: value || !state.fullScreenMode,
});

export const toggleCommentingVisibility: Reducer<UIState> = (state) => ({
  ...state,
  commentsVisible: !state.commentsVisible,
});

export const toggleMentionedThreadsOnlyReducer: Reducer<UIState> = (state) => ({
  ...state,
  mentionedThreadsOnly: !state.mentionedThreadsOnly,
});

export const setLoadingProjectsReducer: Reducer<UIState, SetLoadingProjects> = (state, { payload: isLoadingProjects }) => ({
  ...state,
  isLoadingProjects,
});

const uiReducer: RootReducer<UIState, AnyUIAction | Session.SetActiveWorkspaceID> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UIAction.TOGGLE_BLOCK_MENU_SECTION:
      return toggleBlockMenuSectionReducer(state, action);
    case UIAction.SET_CANVAS_NAVIGATION:
      return setNavigationReducer(state, action);
    case UIAction.TOGGLE_CREATOR_MENU_HIDDEN:
      return toggleCreatorMenuHiddenReducer(state);
    case UIAction.HIDE_CREATOR_MENU:
      return hideCreatorMenuReducer(state);
    case UIAction.SHOW_CREATOR_MENU:
      return showCreatorMenuReducer(state);
    case UIAction.TOGGLE_CANVAS_ONLY:
      return toggleCanvasOnlyReducer(state);
    case UIAction.TOGGLE_CANVAS_GRID:
      return toggleCanvasGridReducer(state);
    case UIAction.TOGGLE_FULL_SCREEN_MODE:
      return toggleFullScreenModeReducer(state, action);
    case UIAction.SET_ZOOM_TYPE:
      return setZoomTypeReducer(state, action);
    case UIAction.SET_LOADING_PROJECTS:
      return setLoadingProjectsReducer(state, action);
    case UIAction.TOGGLE_COMMENT_VISIBILITY:
      return toggleCommentingVisibility(state);
    case UIAction.TOGGLE_MENTIONED_THREADS_ONLY:
      return toggleMentionedThreadsOnlyReducer(state);
    default:
      return state;
  }
};

export default persistReducer(PERSIST_CONFIG, uiReducer);
