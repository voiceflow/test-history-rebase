import IntentSlotForm from '@/components/IntentSlotForm';
import { BlockType } from '@/constants';
import { NodeData } from '@/models';
import { distinctPlatformsData } from '@/utils/platform';

import { NodeManagerConfig } from '../types';
import CommandEditor from './CommandEditor';
import CommandStep from './CommandStep';

const EDITORS_BY_PATH = {
  slot: IntentSlotForm,
};

const CommandManager: NodeManagerConfig<NodeData.Command> = {
  type: BlockType.COMMAND,
  label: BlockType.COMMAND,
  nameEditable: true,

  step: CommandStep,
  editor: CommandEditor,
  editorsByPath: EDITORS_BY_PATH,

  factory: () => ({
    node: {},
    data: {
      name: 'New Command',
      ...distinctPlatformsData({
        intent: null,
        resume: true,
        mappings: [],
        diagramID: null,
      }),
    },
  }),
};

export default CommandManager;
