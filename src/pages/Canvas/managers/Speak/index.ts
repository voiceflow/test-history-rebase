import cuid from 'cuid';

import { BlockType, DialogType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
import SpeakEditor from './SpeakEditor';
import SpeakStep from './SpeakStep';

const SpeakManager: NodeConfig<NodeData.Speak> = {
  type: BlockType.SPEAK,
  icon: 'speak',
  iconColor: '#8f8e94',

  label: 'Speak',
  tip: 'Tell Alexa what to say, or play audio clips',

  step: SpeakStep,
  editor: SpeakEditor,

  factory: (factoryData?) => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Speak',
      randomize: false,
      dialogs: [
        {
          id: cuid.slug(),
          type: DialogType.VOICE,
          voice: 'Alexa',
          content: '',
        },
      ],
      ...factoryData,
    },
  }),
};

export default SpeakManager;
