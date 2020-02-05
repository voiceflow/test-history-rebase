import { BlockType } from '@/constants';
import { NoReplyResponseForm } from '@/containers/CanvasV2/components/NoReplyResponse';
import MicrophoneIcon from '@/svgs/solid/microphone.svg';

import CaptureEditor from './CaptureEditor';

const EDITORS_BY_PATH = {
  noReplyResponse: NoReplyResponseForm,
};

const CaptureManager = {
  type: BlockType.CAPTURE,
  icon: MicrophoneIcon,

  editor: CaptureEditor,
  editorsByPath: EDITORS_BY_PATH,

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
