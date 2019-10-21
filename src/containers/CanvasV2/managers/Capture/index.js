import { BlockType } from '@/constants';
import MicrophoneIcon from '@/svgs/solid/microphone.svg';

import CaptureEditor from './CaptureEditor';

const CaptureManager = {
  type: BlockType.CAPTURE,
  editor: CaptureEditor,
  icon: MicrophoneIcon,

  label: 'Capture',
  tip: 'Capture what the user says into a variable',

  reprompt: true,
  chips: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Capture',
      variable: null,
      slot: null,
      examples: [],
    },
  }),
};

export default CaptureManager;
