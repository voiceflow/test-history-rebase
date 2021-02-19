import { BlockType, CLIPBOARD_DATA_KEY } from '@/constants';
import { BlockVariant } from '@/constants/canvas';
import { ContextMenuTarget } from '@/pages/Canvas/constants';

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
    shouldRender: () => !!localStorage.getItem(CLIPBOARD_DATA_KEY),
  },
  {
    label: 'Return to Home',
    value: CanvasAction.RETURN_TO_HOME,
    shouldRender: (_, { engine }) => !(engine.markup.isActive || engine.comment.isActive),
  },
];

const BLOCKS_WITH_RENAME = [BlockType.COMBINED, BlockType.COMMAND];

const isBlock = (nodeID: string, engine: Engine) => {
  const node = engine.getNodeByID(nodeID);

  if (!node) return false;

  return node.type === BlockType.COMBINED;
};

export const BLOCK_OPTIONS: ContextMenuOption<CanvasAction>[] = [
  {
    label: 'Rename',
    value: CanvasAction.RENAME_BLOCK,
    shouldRender: ({ target: nodeID }, { engine }) => {
      const node = engine.getNodeByID(nodeID!);
      return node && BLOCKS_WITH_RENAME.includes(node.type);
    },
  },
  {
    label: 'Duplicate',
    value: CanvasAction.DUPLICATE_BLOCK,
    shouldRender: ({ target: nodeID }, { engine }) => isBlock(nodeID!, engine),
  },
  {
    label: 'Copy',
    value: CanvasAction.COPY_BLOCK,
    shouldRender: ({ target: nodeID }, { engine }) => isBlock(nodeID!, engine),
  },
  {
    label: 'Color',
    value: CanvasAction.COLOR_BLOCK,
    options: BLOCK_COLORS,
    shouldRender: ({ target: nodeID }, { engine }) => isBlock(nodeID!, engine),
  },
  {
    label: 'Delete',
    value: CanvasAction.DELETE_BLOCK,
  },
];

export const TARGET_OPTIONS = {
  [ContextMenuTarget.NODE]: BLOCK_OPTIONS,
  [ContextMenuTarget.CANVAS]: CANVAS_OPTIONS,
};
