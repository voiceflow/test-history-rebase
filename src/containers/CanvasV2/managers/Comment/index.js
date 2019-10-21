import { BlockType } from '@/constants';

const CommentManager = {
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
