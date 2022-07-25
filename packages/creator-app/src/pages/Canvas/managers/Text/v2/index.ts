import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../../types';
import TextEditor from './TextEditor';
import TextStep from './TextStep';

const TextManagerV2: Partial<NodeManagerConfig<Realtime.NodeData.Text, Realtime.NodeData.TextBuiltInPorts>> = {
  icon: 'systemText',
  label: 'Text',
  step: TextStep,
  editorV2: TextEditor,
};

export default TextManagerV2;
