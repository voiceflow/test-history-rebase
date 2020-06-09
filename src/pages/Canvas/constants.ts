import { ClassName, Identifier } from '@/styles/constants';

export const CANVAS_ACTIVATION_CLASSNAME = `${Identifier.CANVAS}--activation`;
export const CANVAS_DRAGGING_CLASSNAME = `${Identifier.CANVAS}--dragging`;
export const CANVAS_MERGING_CLASSNAME = `${Identifier.CANVAS}--merging`;
export const CANVAS_CREATING_LINK_CLASSNAME = `${Identifier.CANVAS}--creating-link`;
export const CANVAS_MARKUP_ENABLED = `${Identifier.CANVAS}--markup`;
export const CANVAS_MARKUP_CREATING = `${Identifier.CANVAS}--markup-creating`;

export const CANVAS_COMMENTING_ENABLED = `${Identifier.CANVAS}--commenting`;

export const NODE_DISABLED_CLASSNAME = `${ClassName.CANVAS_NODE}--disabled`;
export const NODE_HOVERED_CLASSNAME = `${ClassName.CANVAS_NODE}--hovered`;
export const NODE_HIGHLIGHTED_CLASSNAME = `${ClassName.CANVAS_NODE}--highlighted`;
export const NODE_SELECTED_CLASSNAME = `${ClassName.CANVAS_NODE}--selected`;
export const NODE_FOCUSED_CLASSNAME = `${ClassName.CANVAS_NODE}--focused`;
export const NODE_ACTIVE_CLASSNAME = `${ClassName.CANVAS_NODE}--active`;
export const NODE_MERGE_TARGET_CLASSNAME = `${ClassName.CANVAS_NODE}--merge-target`;
export const NODE_DRAGGING_CLASSNAME = `${ClassName.CANVAS_NODE}--dragging`;

export const LINK_HIGHLIGHTED_CLASSNAME = `${ClassName.CANVAS_LINK}--highlighted`;
export const LINK_ACTIVE_CLASSNAME = `${ClassName.CANVAS_LINK}--active`;

export const PORT_HIGHLIGHTED_CLASSNAME = `${ClassName.CANVAS_PORT}--highlighted`;

export const EDITOR_HEADER_CLASSNAME = `${ClassName.CANVAS_EDITOR}__header`;
export const EDITOR_BREADCRUMBS_CLASSNAME = `${ClassName.CANVAS_EDITOR}__breadcrumbs`;

export const HOME_BLOCK_CLASSNAME = `${ClassName.CANVAS_BLOCK}--home`;
export const FLOW_BLOCK_CLASSNAME = `${ClassName.CANVAS_BLOCK}--flow`;
export const BLOCK_SECTION_CLASSNAME = `${ClassName.CANVAS_BLOCK}__section`;
export const BLOCK_SECTION_TITLE_CLASSNAME = `${ClassName.CANVAS_BLOCK}__section__title`;

export enum OverlayType {
  LINK = 'link',
  CURSOR = 'cursor',
}

export enum ContextMenuTarget {
  NODE = 'node',
  CANVAS = 'canvas',
}

export enum CanvasAction {
  ZOOM = 'zoom',
  PAN = 'pan',
  IDLE = 'idle',
}

export enum CanvasTransformation {
  STRETCH_HORIZONTAL = 'stretchHorizontal',
  STRETCH_VERTICAL = 'stretchVertical',
  SCALE = 'scale',
  ROTATE = 'rotate',
}

export const MAX_ITEMS_PER_EDITOR = 22;
