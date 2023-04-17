import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';

import { NodeManagerConfigV2 } from '../types';
import { Action, Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

const ExitManager: NodeManagerConfigV2<Realtime.NodeData.Exit> = {
  ...NODE_CONFIG,

  label: 'End',

  step: Step,
  action: Action,
  editorV2: Editor,

  tooltipText: 'Defines the terminal point of a conversation.',
  tooltipLink: Documentation.EXIT_STEP,
};

export default ExitManager;
