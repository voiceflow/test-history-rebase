import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import DirectiveEditor from './DirectiveEditor';
import DirectiveStep from './DirectiveStep';

const DirectiveManager: NodeManagerConfig<Realtime.NodeData.Directive, Realtime.NodeData.DirectiveBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Directive',

  step: DirectiveStep,
  editor: DirectiveEditor,
};

export default DirectiveManager;
