import { BlockType, DialogType } from '@/constants';
import CommentIcon from '@/svgs/comment.svg';

import SpeakEditor from './SpeakEditor';

const SpeakManager = {
  type: BlockType.SPEAK,
  editor: SpeakEditor,
  icon: CommentIcon,

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
          type: DialogType.VOICE,
          voice: 'Alexa',
          content: [],
          open: true,
        },
      ],
    },
  }),
};

export default SpeakManager;
