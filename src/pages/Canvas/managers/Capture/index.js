import { BlockType } from '@/constants';
import { NoReplyResponseForm } from '@/pages/Canvas/components/NoReplyResponse';

import CaptureEditor from './CaptureEditor';
import CaptureStep from './CaptureStep';

const EDITORS_BY_PATH = {
  noReplyResponse: NoReplyResponseForm,
};

const CaptureManager = {
  type: BlockType.CAPTURE,
  icon: 'microphone',
  iconColor: '#58457a',

  step: CaptureStep,
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
