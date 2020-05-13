import { BlockType, CLIPBOARD_DATA_KEY } from '@/constants';
import { BlockVariant } from '@/constants/canvas';
import { ContextMenuTarget } from '@/pages/Canvas/constants';

import { ContextMenuOption } from './types';

export enum CanvasAction {
  PASTE = 'paste',
  ADD_COMMENT = 'add_comment',
  RENAME_BLOCK = 'rename_block',
  COPY_BLOCK = 'copy_block',
  DELETE_BLOCK = 'delete_block',
  COLOR_BLOCK = 'color_block',
  RETURN_TO_HOME = 'return_to_home',
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
    label: 'Default',
  },
];

export const CANVAS_OPTIONS: ContextMenuOption<CanvasAction>[] = [
  {
    label: 'Paste',
    value: CanvasAction.PASTE,
    shouldRender: (_, { isMarkupFeatureEnabled }) => {
      return isMarkupFeatureEnabled && !!localStorage.getItem(CLIPBOARD_DATA_KEY);
    },
  },
  {
    label: 'Add Comment',
    value: CanvasAction.ADD_COMMENT,
    shouldRender: (_, { isMarkupModeEnabled }) => {
      return !isMarkupModeEnabled;
    },
  },
  {
    label: 'Return to Home',
    value: CanvasAction.RETURN_TO_HOME,
    shouldRender: (_, { isMarkupModeEnabled }) => {
      return !isMarkupModeEnabled;
    },
  },
];

const BLOCKS_WITHOUT_RENAME = [BlockType.START, BlockType.COMMENT];

export const BLOCK_OPTIONS: ContextMenuOption<CanvasAction>[] = [
  {
    label: 'Rename',
    value: CanvasAction.RENAME_BLOCK,
    shouldRender: ({ target: nodeID }, { engine }) => {
      const node = engine.getNodeByID(nodeID!);

      return node && !BLOCKS_WITHOUT_RENAME.includes(node.type);
    },
  },
  {
    label: 'Copy Block',
    value: CanvasAction.COPY_BLOCK,
    shouldRender: ({ target: nodeID }, { engine }) => {
      const node = engine.getNodeByID(nodeID!);

      if (!node) return false;

      return node.type === BlockType.COMBINED;
    },
  },
  {
    label: 'Block Color',
    value: CanvasAction.COLOR_BLOCK,
    options: BLOCK_COLORS,
  },
  {
    label: 'Delete Block',
    value: CanvasAction.DELETE_BLOCK,
  },
];

export const TARGET_OPTIONS = {
  [ContextMenuTarget.NODE]: BLOCK_OPTIONS,
  [ContextMenuTarget.CANVAS]: CANVAS_OPTIONS,
};
