import { BlockType } from '@/constants';
import { ContextMenuTarget } from '@/containers/CanvasV2/constants';

export const CanvasAction = {
  PASTE: 'paste',
  ADD_COMMENT: 'add_comment',
  RENAME_BLOCK: 'rename_block',
  COPY_BLOCK: 'copy_block',
  DELETE_BLOCK: 'delete_block',
};

export const CANVAS_OPTIONS = [
  {
    label: 'Add Comment',
    value: CanvasAction.ADD_COMMENT,
  },
  {
    label: 'Paste',
    value: CanvasAction.PASTE,
  },
];

const BLOCKS_WITHOUT_RENAME = [BlockType.START, BlockType.FLOW, BlockType.COMMENT];

export const BLOCK_OPTIONS = [
  {
    label: 'Rename',
    value: CanvasAction.RENAME_BLOCK,
    shouldRender: ({ target: nodeID }, { engine }) => {
      const node = engine.getNodeByID(nodeID);

      return node && !BLOCKS_WITHOUT_RENAME.includes(node.type);
    },
  },
  {
    label: 'Copy Block',
    value: CanvasAction.COPY_BLOCK,
    shouldRender: ({ target: nodeID }, { engine }) => {
      const node = engine.getNodeByID(nodeID);

      return node && node.type !== BlockType.COMMAND;
    },
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
