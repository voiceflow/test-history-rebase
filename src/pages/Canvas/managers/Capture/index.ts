import { BlockType } from '@/constants';
import { NodeData } from '@/models';
import { NoReplyResponseForm } from '@/pages/Canvas/components/NoReplyResponse';

import { NodeConfig } from '../types';
import CaptureEditor from './CaptureEditor';
import CaptureStep from './CaptureStep';

const EDITORS_BY_PATH = {
  noReplyResponse: NoReplyResponseForm,
};

const CaptureManager: NodeConfig<NodeData.Capture> = {
  type: BlockType.CAPTURE,
  icon: 'microphone',
  iconColor: '#58457a',
  chips: true,
  reprompt: true,

  label: 'Capture',
  tip: 'Capture what the user says into a variable',

  step: CaptureStep,
  editor: CaptureEditor as React.FC,
  editorsByPath: EDITORS_BY_PATH,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Capture',
      slot: null,
      variable: null,
      examples: [],
      reprompt: null,
    },
  }),
};

export default CaptureManager;
