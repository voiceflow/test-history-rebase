import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import IfEditor from './IfEditorV2';
import IfStep from './IfStep';
import { EDITORS_BY_PATH } from './subeditors';

const IfManagerV2: NodeManagerConfig<Realtime.NodeData.IfV2, Realtime.NodeData.IfV2BuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Condition',

  step: IfStep,
  editor: IfEditor,

  editorsByPath: EDITORS_BY_PATH,
};

export default IfManagerV2;
