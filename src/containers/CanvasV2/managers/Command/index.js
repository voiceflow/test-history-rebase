import { BlockType } from '@/constants';

import CommandEditor from './CommandEditor';

const CommandManager = {
  type: BlockType.COMMAND,
  editor: CommandEditor,

  factory: () => ({
    node: {},
    data: {
      name: 'New Command',
      alexa: {
        intent: null,
        mappings: [],
        resume: true,
      },
      google: {
        intent: null,
        mappings: [],
        resume: true,
      },
    },
  }),
};

export default CommandManager;
