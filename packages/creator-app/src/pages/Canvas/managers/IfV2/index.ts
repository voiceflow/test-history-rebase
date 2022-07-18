import * as Realtime from '@voiceflow/realtime-sdk';

import { LOGIC_STEPS_LINK } from '@/constants';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import IfEditor from './IfEditorV2';
import IfStep from './IfStep';
import { EDITORS_BY_PATH } from './subeditors';
import NodeConfigV2 from './v2';

const IfManagerV2: NodeManagerConfig<Realtime.NodeData.IfV2, Realtime.NodeData.IfV2BuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Condition',

  step: IfStep,
  editor: IfEditor,

  editorsByPath: EDITORS_BY_PATH,

  v2: NodeConfigV2,

  tooltipText: 'Configures ‘If, then’ logic statements for funneling to paths.',
  tooltipLink: LOGIC_STEPS_LINK,
};

export default IfManagerV2;
