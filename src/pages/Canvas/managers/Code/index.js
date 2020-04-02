import { BlockType } from '@/constants';

import CodeEditor from './CodeEditor';
import CodeStep from './CodeStep';

const CodeManager = {
  type: BlockType.CODE,
  icon: 'power',
  iconColor: '#cdad32',

  editor: CodeEditor,
  step: CodeStep,

  label: 'Code',
  labelV2: 'Custom Code',
  tip: 'Modify Variables directly with Code',

  addable: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, { label: 'fail' }],
      },
    },
    data: {
      name: 'Code',
      code: '',
    },
  }),
};

export default CodeManager;
