import cuid from 'cuid';

import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
import SpeakEditor from './SpeakEditor';
import SpeakStep from './SpeakStep';
import { ICON, ICON_COLOR, NAME } from './constants';

const SpeakManager: NodeConfig<NodeData.Speak> = {
  type: BlockType.SPEAK,

  tip: 'Tell Alexa what to say, or play audio clips',
  label: 'Speak',

  step: SpeakStep,
  editor: SpeakEditor,

  getIcon: (data) => ICON[data.dialogs[0].type],
  getIconColor: (data) => ICON_COLOR[data.dialogs[0].type],

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
