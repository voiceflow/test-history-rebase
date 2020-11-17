import { ExpressionType } from '@voiceflow/general-types';
import cuid from 'cuid';

import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
import SetEditor from './SetEditor';
import SetStep from './SetStep';

const SetManager: NodeConfig<NodeData.Set> = {
  type: BlockType.SET,
  icon: 'code',
  iconColor: '#5590b5',

  label: 'Set',
  tip: 'Set the value of a variable, or many variables at once',

  step: SetStep,
  editor: SetEditor,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Set',
      sets: [
        {
          id: cuid.slug(),
          expression: { id: cuid.slug(), type: ExpressionType.VALUE, value: '', depth: 0 },
          variable: null,
        },
      ],
    },
  }),
};

export default SetManager;
