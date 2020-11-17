import IntentSlotForm from '@/components/IntentSlotForm';
import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
import CommandEditor from './CommandEditor';
import CommandStep from './CommandStep';

const EDITORS_BY_PATH = {
  slot: IntentSlotForm,
};

const CommandManager: NodeConfig<NodeData.Command> = {
  type: BlockType.COMMAND,
  label: BlockType.COMMAND,
  nameEditable: true,

  step: CommandStep,
  editor: CommandEditor,
  editorsByPath: EDITORS_BY_PATH,

  factory: (factoryData?) => ({
    node: {},
    data: {
      name: 'New Command',
      alexa: {
        intent: null,
        diagramID: null,
        mappings: [],
        resume: true,
      },
      google: {
        intent: null,
        diagramID: null,
        mappings: [],
        resume: true,
      },
      general: {
        intent: null,
        diagramID: null,
        mappings: [],
        resume: true,
      },
      ...factoryData,
    },
  }),
};

export default CommandManager;
