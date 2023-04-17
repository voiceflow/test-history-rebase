import { hexToRGBA } from '@voiceflow/ui';

import { ClassName, Identifier } from '@/styles/constants';

export const CANVAS_ACTIVATION_CLASSNAME = `${Identifier.CANVAS}--activation`;
export const CANVAS_DRAGGING_CLASSNAME = `${Identifier.CANVAS}--dragging`;
export const CANVAS_MERGING_CLASSNAME = `${Identifier.CANVAS}--merging`;
export const CANVAS_CREATING_LINK_CLASSNAME = `${Identifier.CANVAS}--creating-link`;
export const CANVAS_CREATING_LINK_BLOCK_VIA_LINK_MODE_CLASSNAME = `${Identifier.CANVAS}--creating-link-attached`;
export const CANVAS_SELECTING_GROUP_CLASSNAME = `${Identifier.CANVAS}--selecting-group`;
export const CANVAS_MARKUP_CREATING_CLASSNAME = `${Identifier.CANVAS}--markup-creating`;
export const CANVAS_MARKUP_TRANSFORMING_CLASSNAME = `${Identifier.CANVAS}--markup-transforming`;
export const CANVAS_COMMENTING_ENABLED_CLASSNAME = `${Identifier.CANVAS}--commenting`;
export const CANVAS_THREAD_OPEN_CLASSNAME = `${Identifier.CANVAS}--thread-open`;
export const CANVAS_PROTOTYPE_ENABLED_CLASSNAME = `${Identifier.CANVAS}--prototype`;
export const CANVAS_PROTOTYPE_RUNNING_CLASSNAME = `${Identifier.CANVAS}--prototype-running`;

export const NODE_DISABLED_CLASSNAME = `${ClassName.CANVAS_NODE}--disabled`;
export const NODE_HOVERED_CLASSNAME = `${ClassName.CANVAS_NODE}--hovered`;
export const NODE_HIGHLIGHTED_CLASSNAME = `${ClassName.CANVAS_NODE}--highlighted`;
export const NODE_SELECTED_CLASSNAME = `${ClassName.CANVAS_NODE}--selected`;
export const NODE_PROTOTYPE_HIGHLIGHTED_CLASSNAME = `${ClassName.CANVAS_NODE}--prototype-highlighted`;
export const NODE_FOCUSED_CLASSNAME = `${ClassName.CANVAS_NODE}--focused`;
export const NODE_ACTIVE_CLASSNAME = `${ClassName.CANVAS_NODE}--active`;
export const NODE_MERGE_TARGET_CLASSNAME = `${ClassName.CANVAS_NODE}--merge-target`;
export const NODE_THREAD_TARGET_CLASSNAME = `${ClassName.CANVAS_NODE}--thread-target`;
export const NODE_DRAGGING_CLASSNAME = `${ClassName.CANVAS_NODE}--dragging`;

export const LINK_HIGHLIGHTED_CLASSNAME = `${ClassName.CANVAS_LINK}--highlighted`;
export const LINK_ACTIVE_CLASSNAME = `${ClassName.CANVAS_LINK}--active`;

export const PORT_HIGHLIGHTED_CLASSNAME = `${ClassName.CANVAS_PORT}--highlighted`;
export const PORT_PROTOTYPE_END_UNLINKED_CLASSNAME = `${ClassName.CANVAS_PORT}--prototype-end-unlinked-port`;

export const EDITOR_HEADER_CLASSNAME = `${ClassName.CANVAS_EDITOR}__header`;
export const EDITOR_BREADCRUMBS_CLASSNAME = `${ClassName.CANVAS_EDITOR}__breadcrumbs`;

export const HOME_BLOCK_CLASSNAME = `${ClassName.CANVAS_BLOCK}--home`;

export const HOME_CHIP_CLASSNAME = `${ClassName.CANVAS_CHIP}--home`;
export const COMPONENT_CHIP_CLASSNAME = `${ClassName.CANVAS_CHIP}--component`;

export const BLOCK_SECTION_CLASSNAME = `${ClassName.CANVAS_BLOCK}__section`;
export const BLOCK_SECTION_TITLE_CLASSNAME = `${ClassName.CANVAS_BLOCK}__section__title`;

export const DEFAULT_MARKUP_BORDER_RADIUS = 5;
export const DEFAULT_MARKUP_LINE_COLOR = hexToRGBA('#62778cff');
export const DEFAULT_MARKUP_BORDER_COLOR = hexToRGBA('#5d9df5ff');
export const DEFAULT_MARKUP_BACKGROUND_COLOR = hexToRGBA('#5d9df533');

export enum OverlayType {
  CURSOR = 'cursor',
  CURSOR_V2 = 'cursorV2',
}

export enum ContextMenuTarget {
  NODE = 'node',
  CANVAS = 'canvas',
  SELECTION = 'selection',
}

export enum CanvasAction {
  PAN = 'pan',
  IDLE = 'idle',
  ZOOM = 'zoom',
  CLICK = 'click',
  RENDERED = 'rendered',
  MOVE_MOUSE = 'moveMouse',
  PAN_APPLIED = 'panApplied',
  ZOOM_APPLIED = 'zoomApplied',
}

export enum CanvasTransformation {
  STRETCH_HORIZONTAL = 'stretchHorizontal',
  STRETCH_VERTICAL = 'stretchVertical',
  SCALE = 'scale',
  ROTATE = 'rotate',
}

export enum EditorAnimationEffect {
  POP = 'pop',
  PUSH = 'push',
}

export const SLOT_PATH_TYPE = 'slot';

export const WAITING_FOR_INTENT_PLACEHOLDER = 'Listening for an intent…';
