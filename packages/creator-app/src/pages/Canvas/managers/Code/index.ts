import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import CodeEditor from './CodeEditor';
import CodeStep from './CodeStep';
import { NODE_CONFIG } from './constants';

const CodeManager: NodeManagerConfig<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts> = {
  ...NODE_CONFIG,

  tip: 'Modify Variables directly with Code',
  label: 'Custom Code',

  step: CodeStep,
  editor: CodeEditor,
};

export default CodeManager;
