import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import CodeEditor from './CodeEditor';
import CodeStep from './CodeStep';
import { NODE_CONFIG } from './constants';
import CodeManagerV2 from './v2';

const CodeManager: NodeManagerConfig<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Custom Code',

  step: CodeStep,
  editor: CodeEditor,

  v2: CodeManagerV2,
};

export default CodeManager;
