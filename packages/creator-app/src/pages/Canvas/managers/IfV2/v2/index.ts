import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfigV2 } from '../../types';
import IfEditor from './IfEditor';

const IfManagerV2: Partial<NodeManagerConfigV2<Realtime.NodeData.IfV2, Realtime.NodeData.IfV2BuiltInPorts>> = {
  editorV2: IfEditor,
};

export default IfManagerV2;
