import * as Realtime from '@voiceflow/realtime-sdk';

import { NO_REPLY_PATH_TYPE, NoReplyEditor } from '@/pages/Canvas/components/NoReply';

import { NodeManagerConfig } from '../types';
import CaptureEditor from './CaptureEditor';
import CaptureStep from './CaptureStep';
import { NODE_CONFIG } from './constants';

const EDITORS_BY_PATH = {
  [NO_REPLY_PATH_TYPE]: NoReplyEditor,
};

const CaptureManager: NodeManagerConfig<Realtime.NodeData.Capture> = {
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
