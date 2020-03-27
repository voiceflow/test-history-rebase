import cuid from 'cuid';

import { BlockType, ExpressionType } from '@/constants';

import SetEditor from './SetEditor';
import SetStep from './SetStep';

const SetManager = {
  type: BlockType.SET,
  editor: SetEditor,
  icon: 'code',
  iconColor: '#5590b5',

  step: SetStep,
  label: 'Set',
  tip: 'Set the value of a variable, or many variables at once',

  addable: true,

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
          expression: { type: ExpressionType.VALUE, value: '', depth: 0 },
          variable: null,
        },
      ],
    },
  }),
};

export default SetManager;
