import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import SetEditor from './SetEditorV2';
import SetStep from './SetStep';

const SetManager: NodeManagerConfig<NodeData.SetV2> = {
  ...NODE_CONFIG,

  tip: 'Set the value of a variable, or many variables at once',
  label: 'Set',

  step: SetStep,
  editor: SetEditor,
};

export default SetManager;
