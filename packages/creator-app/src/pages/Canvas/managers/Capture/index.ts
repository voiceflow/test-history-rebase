import { NodeData } from '@/models';
import { NO_REPLY_RESPONSE_PATH_TYPE, NoReplyResponseForm } from '@/pages/Canvas/components/NoReplyResponse';

import { NodeManagerConfig } from '../types';
import CaptureEditor from './CaptureEditor';
import CaptureStep from './CaptureStep';
import { NODE_CONFIG } from './constants';

const EDITORS_BY_PATH = {
  [NO_REPLY_RESPONSE_PATH_TYPE]: NoReplyResponseForm,
};

const CaptureManager: NodeManagerConfig<NodeData.Capture> = {
  ...NODE_CONFIG,

  tip: 'Capture what the user says into a variable',
  label: 'Capture',
  buttons: true,
  reprompt: true,

  step: CaptureStep,
  editor: CaptureEditor as React.FC,
  editorsByPath: EDITORS_BY_PATH,
};

export default CaptureManager;
