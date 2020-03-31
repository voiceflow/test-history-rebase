import cuid from 'cuid';

import { BlockType, ExpressionType } from '@/constants';

import IfEditor from './IfEditor';
import IfStep from './IfStep';

const IfManager = {
  type: BlockType.IF,
  editor: IfEditor,
  icon: 'if',
  iconColor: '#f86683',

  step: IfStep,
  label: 'If',
  labelV2: 'Condition',
  tip: 'Set conditions that activate paths only when true',

  mergeTerminator: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, {}],
      },
    },
    data: {
      name: 'If',
      expressions: [
        {
          id: cuid.slug(),
          type: ExpressionType.EQUALS,
          depth: 0,
          value: [
            {
              type: ExpressionType.VARIABLE,
              value: null,
              depth: 1,
            },
            {
              type: ExpressionType.VALUE,
              value: '',
              depth: 1,
            },
          ],
        },
      ],
    },
  }),
};

export default IfManager;
