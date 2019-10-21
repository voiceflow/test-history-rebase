import { BlockCategoryType, BlockType } from '@/constants';

export const ContextMenuTarget = {
  NODE: 'node',
  CANVAS: 'canvas',
};

export const MergeStatus = {
  ACCEPT: 'accept',
  COMBINED_ACCEPT: 'combined_accept',
  DENY: 'deny',
};

export const BLOCK_MENU_CATEGORIES = {
  [BlockCategoryType.BASIC]: {
    label: 'Basic',
    color: '#42a5ff',
  },
  [BlockCategoryType.LOGIC]: {
    label: 'Logic',
    color: '#627ff9',
  },
  [BlockCategoryType.ADVANCED]: {
    label: 'Advanced',
    color: '#fa7891',
  },
  [BlockCategoryType.VISUAL]: {
    label: 'Visuals',
    color: '#f6c16b',
  },
  [BlockCategoryType.USER]: {
    label: 'User',
    color: '#2fd0c1',
  },
};

// const BLOCK_TYPES = {
//   combine: {
//     text: 'Combine',
//     type: 'combine',
//     icon: <i className="fas fa-compress-alt" />,
//     tip: 'Combine Different Audio Files to bypass Amazon 5 Audio limit',
//   },
//   comment: {
//     text: 'Comment',
//     type: 'comment',
//     icon: <i className="far fa-comment-alt" />,
//     tip: 'Add notes to your diagram',
//   },
// };

export const BLOCK_MENU = [
  {
    type: BlockCategoryType.BASIC,
    items: [BlockType.SPEAK, BlockType.CHOICE],
  },
  {
    type: BlockCategoryType.LOGIC,
    items: [BlockType.SET, BlockType.IF, BlockType.CAPTURE, BlockType.RANDOM],
  },
  {
    type: BlockCategoryType.ADVANCED,
    items: [BlockType.INTERACTION, BlockType.INTENT, BlockType.STREAM, BlockType.INTEGRATION, BlockType.FLOW, BlockType.CODE, BlockType.EXIT],
  },
  {
    type: BlockCategoryType.VISUAL,
    items: [BlockType.CARD, BlockType.DISPLAY],
  },
  {
    type: BlockCategoryType.USER,
    items: [BlockType.PERMISSION, BlockType.USER_INFO, BlockType.PAYMENT, BlockType.CANCEL_PAYMENT, BlockType.REMINDER],
  },
];

export const BLOCK_CATEGORIES = BLOCK_MENU.reduce(
  (acc, { items, type: category }) => {
    items.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      acc[item] = category;
    });

    return acc;
  },
  {
    [BlockType.COMMAND]: BlockCategoryType.ADVANCED,
  }
);

export function getBlockCategory(type) {
  if (type === BlockType.DEPRECATED) {
    return {
      color: 'lightgrey',
    };
  }
  const category = BLOCK_CATEGORIES[type];
  return BLOCK_MENU_CATEGORIES[category];
}
