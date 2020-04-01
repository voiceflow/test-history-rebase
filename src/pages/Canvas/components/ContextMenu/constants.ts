import { BlockType } from '@/constants';
import { BlockVariant } from '@/constants/canvas';
import { ContextMenuTarget } from '@/pages/Canvas/constants';
import { ContextMenuValue, Engine } from '@/pages/Canvas/contexts';

export enum CanvasAction {
  PASTE = 'paste',
  ADD_COMMENT = 'add_comment',
  RENAME_BLOCK = 'rename_block',
  COPY_BLOCK = 'copy_block',
  DELETE_BLOCK = 'delete_block',
  COLOR_BLOCK = 'color_block',
  RETURN_TO_HOME = 'return_to_home',
}

export const BLOCK_COLORS = [
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
];

export const CANVAS_OPTIONS = [
  {
    label: 'Add Comment',
    value: CanvasAction.ADD_COMMENT,
  },
  {
    label: 'Paste',
    value: CanvasAction.PASTE,
  },
  {
    label: 'Return to Home',
    value: CanvasAction.RETURN_TO_HOME,
  },
];

const BLOCKS_WITHOUT_RENAME = [BlockType.START, BlockType.COMMENT];

export type BlockMenuOption = {
  label: string;
  value: CanvasAction;
  shouldRender?: (contextMenu: ContextMenuValue, props: { engine: Engine }) => boolean;

  [key: string]: any;
};

export const BLOCK_OPTIONS: BlockMenuOption[] = [
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

      return engine.isBlockRedesignEnabled() ? node.type === BlockType.COMBINED : node.type !== BlockType.COMMAND;
    },
  },
  {
    label: 'Block Color',
    value: CanvasAction.COLOR_BLOCK,
    options: BLOCK_COLORS,
    shouldRender: (_, { engine }) => engine.isBlockRedesignEnabled(),
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
