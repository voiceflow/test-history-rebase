import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';

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

  tooltipText: 'Executes custom JavaScript (ES6) code in the project.',
  tooltipLink: Documentation.CODE_STEP,
};

export default CodeManager;
