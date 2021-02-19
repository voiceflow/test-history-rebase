import cuid from 'cuid';

import { BlockType, DialogType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
import { ICON, ICON_COLOR, NAME } from './constants';
import SpeakEditor from './SpeakEditor';
import SpeakStep from './SpeakStep';

const SpeakManager: NodeConfig<NodeData.Speak> = {
  type: BlockType.SPEAK,

  tip: 'Tell Alexa what to say, or play audio clips',
  label: 'Speak',

  step: SpeakStep,
  editor: SpeakEditor,

  getIcon: (data) => ICON[data?.dialogs[0]?.type] || ICON[DialogType.VOICE],
  getIconColor: (data) => ICON_COLOR[data?.dialogs[0]?.type] || ICON_COLOR[DialogType.VOICE],

  factory: (data, options) => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: NAME[data!.dialogs![0].type],
      randomize: false,
      dialogs: [
        {
          id: cuid.slug(),
          type: data!.dialogs![0]!.type,
          voice: options?.defaultVoice ?? '',
          content: '',
        },
      ],
    },
  }),
};

export default SpeakManager;
