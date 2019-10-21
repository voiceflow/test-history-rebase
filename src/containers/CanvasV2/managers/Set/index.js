import { BlockType, ExpressionType } from '@/constants';
import CodeIcon from '@/svgs/solid/code.svg';

import SetEditor from './SetEditor';

const SetManager = {
  type: BlockType.SET,
  editor: SetEditor,
  icon: CodeIcon,

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
          expression: { type: ExpressionType.VALUE, value: '', depth: 0 },
          variable: null,
        },
      ],
    },
  }),
};

export default SetManager;
