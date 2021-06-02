import { BlockType } from '@/constants';

import { BasicNodeManagerConfig } from '../types';

const CommentManager: BasicNodeManagerConfig = {
  type: BlockType.COMMENT,

  factory: () => ({
    node: { ports: {} },
    data: {
      name: 'New Comment',
    },
  }),
};

export default CommentManager;
