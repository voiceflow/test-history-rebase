import IntentSlotForm from '@/components/IntentSlotForm';
import { BlockType } from '@/constants';

import CommandEditor from './CommandEditor';

const EDITORS_BY_PATH = {
  slot: IntentSlotForm,
};

const CommandManager = {
  type: BlockType.COMMAND,
  label: BlockType.COMMAND,

  editor: CommandEditor,
  editorsByPath: EDITORS_BY_PATH,

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
