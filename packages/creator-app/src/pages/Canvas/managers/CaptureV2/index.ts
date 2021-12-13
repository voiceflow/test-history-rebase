import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import CaptureEditor from './CaptureEditor';
import CaptureStep from './CaptureStep';
import { NODE_CONFIG } from './constants';
import { EDITORS_BY_PATH } from './subeditors';

const CaptureV2Manager: NodeManagerConfig<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts> = {
  ...NODE_CONFIG,

  tip: 'Capture what the user says',
  label: 'Capture',
  reprompt: true,

  mergeTerminator: true,

  step: CaptureStep,
  editor: CaptureEditor,
  editorsByPath: EDITORS_BY_PATH,
};

export default CaptureV2Manager;
