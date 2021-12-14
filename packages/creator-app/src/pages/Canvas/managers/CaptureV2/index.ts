import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import CaptureEditorV2 from './CaptureEditorV2';
import CaptureStepV2 from './CaptureStepV2';
import { NODE_CONFIG } from './constants';
import { EDITORS_BY_PATH } from './subeditors';

const CaptureV2Manager: NodeManagerConfig<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts> = {
  ...NODE_CONFIG,

  tip: 'Capture what the user says',
  label: 'Capture',
  reprompt: true,

  mergeTerminator: true,

  step: CaptureStepV2,
  editor: CaptureEditorV2,
  editorsByPath: EDITORS_BY_PATH,
};

export default CaptureV2Manager;
