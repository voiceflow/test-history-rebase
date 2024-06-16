import { persistReducer } from 'redux-persist';
import storageLocal from 'redux-persist/lib/storage';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import {
  SetCanvasNavigation,
  SetCanvasSidebarWidth,
  SetZoomType,
  ToggleCanvasGrid,
  ToggleCanvasOnly,
  ToggleCanvasSidebar,
  ToggleCommentVisibility,
  ToggleMentionedThreadsOnly,
  ToggleWorkflowThreadsOnly,
} from './ui.action';
import type { UIState } from './ui.state';
import { INITIAL_STATE, STATE_KEY } from './ui.state';

const baseUIReducer = reducerWithInitialState<UIState>(INITIAL_STATE)
  .case(SetZoomType, (state, zoomType) => ({ ...state, zoomType }))
  .case(SetCanvasNavigation, (state, canvasNavigation) => ({ ...state, canvasNavigation }))
  .case(SetCanvasSidebarWidth, (state, width) => ({
    ...state,
    canvasSidebar: { ...state.canvasSidebar, width, visible: state.canvasSidebar?.visible ?? true },
  }))
  .case(ToggleCanvasGrid, (state) => ({ ...state, canvasGrid: !state.canvasGrid }))
  .case(ToggleCanvasOnly, (state) => ({ ...state, canvasOnly: !state.canvasOnly }))
  .case(ToggleCanvasSidebar, (state, visible) => ({
    ...state,
    canvasSidebar: { ...state.canvasSidebar, visible: visible ?? !state.canvasSidebar?.visible },
  }))
  .case(ToggleCommentVisibility, (state) => ({ ...state, commentsVisible: !state.commentsVisible }))
  .case(ToggleMentionedThreadsOnly, (state) => ({ ...state, mentionedThreadsOnly: !state.mentionedThreadsOnly }))
  .case(ToggleWorkflowThreadsOnly, (state) => ({ ...state, workflowThreadsOnly: !state.workflowThreadsOnly }));

export const uiReducer = persistReducer(
  {
    key: STATE_KEY,
    storage: storageLocal,
    blacklist: ['canvasOnly'],
  },
  baseUIReducer
);
