import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import DirectiveEditor from './DirectiveEditor';
import DirectiveStep from './DirectiveStep';

const DirectiveManager: NodeManagerConfig<NodeData.Directive> = {
  ...NODE_CONFIG,

  tip: 'send directive to alexa',
  label: 'Directive',

  step: DirectiveStep,
  editor: DirectiveEditor,
};

export default DirectiveManager;
