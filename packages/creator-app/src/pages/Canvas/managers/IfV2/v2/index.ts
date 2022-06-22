import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfigV2 } from '../../types';
import { IF_V2_ICON } from './constants';
import IfEditor from './IfEditor';
import IfStep from './IfStep';

const IfManagerV2: Partial<NodeManagerConfigV2<Realtime.NodeData.IfV2, Realtime.NodeData.IfV2BuiltInPorts>> = {
  editorV2: IfEditor,
  editorsByPath: undefined,
  step: IfStep,
  icon: IF_V2_ICON,
};

export default IfManagerV2;
