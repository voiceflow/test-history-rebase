import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfigV2 } from '../../types';
import SetEditor from './SetEditor';
import ConnectedSetStep from './SetStep';

const SetManagerV2: Partial<NodeManagerConfigV2<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts>> = {
  editorV2: SetEditor,
  step: ConnectedSetStep,
};

export default SetManagerV2;
