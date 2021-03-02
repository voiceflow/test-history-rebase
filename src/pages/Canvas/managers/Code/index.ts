import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import CodeEditor from './CodeEditor';
import CodeStep from './CodeStep';
import { NODE_CONFIG } from './constants';

const CodeManager: NodeManagerConfig<NodeData.Code> = {
  ...NODE_CONFIG,

  tip: 'Modify Variables directly with Code',
  label: 'Custom Code',

  step: CodeStep,
  editor: CodeEditor,
};

export default CodeManager;
