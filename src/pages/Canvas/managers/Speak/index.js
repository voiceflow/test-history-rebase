import cuid from 'cuid';

import { BlockType, DialogType } from '@/constants';

import SpeakEditor from './SpeakEditor';
import SpeakStep from './SpeakStep';

const SpeakManager = {
  type: BlockType.SPEAK,
  editor: SpeakEditor,
  icon: 'speak',
  iconColor: '#8f8e94',

  step: SpeakStep,

  label: 'Speak',
  tip: 'Tell Alexa what to say, or play audio clips',

  addable: true,

  factory: () => ({
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
          open: true,
        },
      ],
    },
  }),
};

export default SpeakManager;
