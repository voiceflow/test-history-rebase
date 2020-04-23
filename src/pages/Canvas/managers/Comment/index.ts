import { BlockType } from '@/constants';

import { BasicNodeConfig } from '../types';

const CommentManager: BasicNodeConfig = {
  type: BlockType.COMMENT,

  factory: () => ({
    node: {
      ports: {},
    },
    data: {
      name: 'New Comment',
    },
  }),
};

export default CommentManager;
