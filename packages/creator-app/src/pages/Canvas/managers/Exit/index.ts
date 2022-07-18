import { LOGIC_STEPS_LINK } from '@/constants';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import ExitEditor from './ExitEditor';
import ExitStep from './ExitStep';

const ExitManager: NodeManagerConfig<{}> = {
  ...NODE_CONFIG,

  label: 'Exit',

  step: ExitStep,
  editor: ExitEditor,

  tooltipText: 'Defines the terminal point of a conversation.',
  tooltipLink: LOGIC_STEPS_LINK,
};

export default ExitManager;
