import type * as Realtime from '@voiceflow/realtime-sdk';

import type { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import DeprecatedEditor from './DeprecatedEditor';
import DeprecatedStep from './DeprecatedStep';

const DeprecatedManager: NodeManagerConfig<Realtime.NodeData.Deprecated> = {
  ...NODE_CONFIG,

  label: 'Deprecated',

  step: DeprecatedStep,
  editor: DeprecatedEditor,
};

export default DeprecatedManager;
