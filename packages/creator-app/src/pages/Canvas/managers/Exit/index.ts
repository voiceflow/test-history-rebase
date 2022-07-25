import * as Documentation from '@/config/documentation';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import ExitEditor from './ExitEditor';
import ExitStep from './ExitStep';

const ExitManager: NodeManagerConfig<{}> = {
  ...NODE_CONFIG,

  label: 'End',

  step: ExitStep,
  editor: ExitEditor,

  tooltipText: 'Defines the terminal point of a conversation.',
  tooltipLink: Documentation.EXIT_STEP,
};

export default ExitManager;
