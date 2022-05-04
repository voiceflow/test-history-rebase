import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import ExitEditor from './ExitEditor';
import ExitStep from './ExitStep';

const ExitManager: NodeManagerConfig<{}> = {
  ...NODE_CONFIG,

  label: 'Exit',

  step: ExitStep,
  editor: ExitEditor,
};

export default ExitManager;
