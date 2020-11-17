import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
import DirectiveEditor from './DirectiveEditor';
import DirectiveStep from './DirectiveStep';

const DirectiveManager: NodeConfig<NodeData.Directive> = {
  type: BlockType.DIRECTIVE,
  editor: DirectiveEditor,
  icon: 'back',
  iconColor: '#5589eb',

  step: DirectiveStep,
  label: 'Directive',
  tip: 'send directive to alexa',

  factory: (factoryData?) => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Directive',
      directive: '',
      ...factoryData,
    },
  }),
};

export default DirectiveManager;
