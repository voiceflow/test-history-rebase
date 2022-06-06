import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../../types';
import CodeEditor from './CodeEditor';
import CodeStep from './CodeStep';
import { CODE_STEP_ICON } from './constants';

export const CodeManagerV2: Partial<NodeManagerConfig<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts>> = {
  icon: CODE_STEP_ICON,
  step: CodeStep,
  editorV2: CodeEditor,
};

export default CodeManagerV2;
