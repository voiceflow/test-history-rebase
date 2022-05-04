import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import CaptureEditor from './CaptureEditor';
import CaptureStep from './CaptureStep';
import { NODE_CONFIG } from './constants';
import { EDITORS_BY_PATH } from './subeditors';

const CaptureManager: NodeManagerConfig<Realtime.NodeData.Capture, Realtime.NodeData.CaptureBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Capture',

  step: CaptureStep,
  editor: CaptureEditor,
  editorsByPath: EDITORS_BY_PATH,
};

export default CaptureManager;
