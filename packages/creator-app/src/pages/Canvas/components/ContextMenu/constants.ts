import { BlockType, CLIPBOARD_DATA_KEY } from '@/constants';
import { BlockVariant } from '@/constants/canvas';
import { Hotkey, HOTKEY_LABEL_MAP, PLATFORM_META_KEY_LABEL } from '@/keymap';
import { ContextMenuTarget } from '@/pages/Canvas/constants';
import { isMarkupBlockType } from '@/utils/typeGuards';

import { Engine } from '../../engine';
import { ContextMenuOption } from './types';

export enum CanvasAction {
  PASTE = 'paste',
  RENAME_BLOCK = 'rename_block',
  COPY_BLOCK = 'copy_block',
  DUPLICATE_BLOCK = 'duplicate_block',
  DELETE_BLOCK = 'delete_block',
  COLOR_BLOCK = 'color_block',
  RETURN_TO_HOME = 'return_to_home',
  ZOOM_IN = 'zoom_in',
  ZOOM_OUT = 'zoom_out',
  DIVIDER = 'divider',
  TOGGLE_UI = 'toggle_ui',
  ADD_TEXT = 'add_text',
  ADD_IMAGE = 'add_image',
  ADD_COMMENT = 'add_comment',
}

export const BLOCK_COLORS: ContextMenuOption<BlockVariant>[] = [
  {
    value: BlockVariant.BLUE,
    label: 'Blue',
  },
  {
    value: BlockVariant.GREEN,
    label: 'Green',
  },
  {
    value: BlockVariant.PURPLE,
    label: 'Purple',
  },
  {
    value: BlockVariant.RED,
    label: 'Red',
  },
  {
    value: BlockVariant.STANDARD,
    label: 'Gray',
  },
];

export const CANVAS_OPTIONS: ContextMenuOption<CanvasAction>[] = [
  {
    label: 'Paste',
    value: CanvasAction.PASTE,
    hotkey: `${PLATFORM_META_KEY_LABEL}+V`,
    shouldRender: () => !!localStorage.getItem(CLIPBOARD_DATA_KEY),
  },
  {
    label: 'Divider 1',
    value: CanvasAction.DIVIDER,
    menuItemProps: { divider: true },
    shouldRender: () => !!localStorage.getItem(CLIPBOARD_DATA_KEY),
  },
  {
    label: 'Add Text',
    value: CanvasAction.ADD_TEXT,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.ADD_MARKUP_TEXT],
    shouldRender: (_, { showHintFeatures, navigationRedesign }) => showHintFeatures && !navigationRedesign,
  },
  {
    label: 'Add Text',
    value: CanvasAction.ADD_TEXT,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.ADD_MARKUP_TEXT_V2],
    shouldRender: (_, { showHintFeatures, navigationRedesign }) => showHintFeatures && !!navigationRedesign,
  },
  {
    label: 'Add Image',
    value: CanvasAction.ADD_IMAGE,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.ADD_MARKUP_IMAGE],
    shouldRender: (_, { showHintFeatures }) => showHintFeatures,
  },
  {
    label: 'Add Comment',
    value: CanvasAction.ADD_COMMENT,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.OPEN_COMMENTING],
    shouldRender: (_, { showHintFeatures }) => showHintFeatures,
  },
  {
    label: 'Divider 2',
    value: CanvasAction.DIVIDER,
    menuItemProps: { divider: true },
    shouldRender: (_, { showHintFeatures }) => showHintFeatures,
  },
  {
    label: 'Return to Start',
    value: CanvasAction.RETURN_TO_HOME,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.ROOT_NODE],
    shouldRender: (_, { engine }) => !engine.comment.isActive,
  },
  {
    label: 'Zoom In',
    value: CanvasAction.ZOOM_IN,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.ZOOM_IN],
    shouldRender: (_, { navigationRedesign }) => !!navigationRedesign,
  },
  {
    label: 'Zoom Out',
    value: CanvasAction.ZOOM_OUT,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.ZOOM_OUT],
    shouldRender: (_, { navigationRedesign }) => !!navigationRedesign,
  },
  {
    label: 'Hide/Show UI',
    value: CanvasAction.TOGGLE_UI,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.SHOW_HIDE_UI],
  },
];

const BLOCKS_WITH_RENAME = [BlockType.COMBINED, BlockType.COMMAND];

const isBlock = (nodeID: string, engine: Engine) => {
  const node = engine.getNodeByID(nodeID);

  if (!node) return false;

  return node.type === BlockType.COMBINED;
};

const isMarkup = (nodeID: string, engine: Engine) => {
  const node = engine.getNodeByID(nodeID);

  if (!node) return false;

  return isMarkupBlockType(node.type);
};

export const BLOCK_OPTIONS: ContextMenuOption<CanvasAction>[] = [
  {
    label: 'Block Color',
    value: CanvasAction.COLOR_BLOCK,
    options: BLOCK_COLORS,
    shouldRender: ({ target: nodeID }, { engine }) => isBlock(nodeID!, engine),
  },
  {
    label: 'Rename',
    value: CanvasAction.RENAME_BLOCK,
    shouldRender: ({ target: nodeID }, { engine }) => BLOCKS_WITH_RENAME.includes(engine.getNodeByID(nodeID!)?.type),
  },
  {
    label: 'Add Comment',
    value: CanvasAction.ADD_COMMENT,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.OPEN_COMMENTING],
    shouldRender: ({ target: nodeID }, { engine, showHintFeatures }) => showHintFeatures && !isMarkup(nodeID!, engine),
  },
  {
    label: 'Divider 1',
    value: CanvasAction.DIVIDER,
    menuItemProps: { divider: true },
    shouldRender: ({ target: nodeID }, { engine, showHintFeatures }) =>
      (showHintFeatures && !isMarkup(nodeID!, engine)) || isBlock(nodeID!, engine) || BLOCKS_WITH_RENAME.includes(engine.getNodeByID(nodeID!)?.type),
  },
  {
    label: 'Copy',
    value: CanvasAction.COPY_BLOCK,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.COPY],
  },
  {
    label: 'Duplicate',
    value: CanvasAction.DUPLICATE_BLOCK,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.DUPLICATE],
  },
  {
    label: 'Divider 2',
    value: CanvasAction.DIVIDER,
    menuItemProps: { divider: true },
  },
  {
    label: 'Delete',
    value: CanvasAction.DELETE_BLOCK,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.DELETE],
  },
];

export const SELECTION_OPTIONS: ContextMenuOption<CanvasAction>[] = [
  {
    label: 'Copy',
    value: CanvasAction.COPY_BLOCK,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.COPY],
  },
  {
    label: 'Divider 2',
    value: CanvasAction.DIVIDER,
    menuItemProps: { divider: true },
  },
  {
    label: 'Delete',
    value: CanvasAction.DELETE_BLOCK,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.DELETE],
  },
];

export const TARGET_OPTIONS = {
  [ContextMenuTarget.NODE]: BLOCK_OPTIONS,
  [ContextMenuTarget.CANVAS]: CANVAS_OPTIONS,
  [ContextMenuTarget.SELECTION]: SELECTION_OPTIONS,
};
