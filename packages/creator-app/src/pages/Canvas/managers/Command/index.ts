import * as Realtime from '@voiceflow/realtime-sdk';

import { SLOT_PATH_TYPE } from '@/components/IntentForm/components/Custom/components';
import IntentSlotForm from '@/components/IntentSlotForm';
import { BlockType } from '@/constants';
import { distinctPlatformsData } from '@/utils/platform';

import { NodeManagerConfig } from '../types';
import CommandEditor from './CommandEditor';
import CommandStep from './CommandStep';

const EDITORS_BY_PATH = {
  [SLOT_PATH_TYPE]: IntentSlotForm,
};

const CommandManager: NodeManagerConfig<Realtime.NodeData.Command> = {
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
