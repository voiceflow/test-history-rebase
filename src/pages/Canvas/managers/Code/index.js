import { BlockType } from '@/constants';
import JavaScriptIcon from '@/svgs/brands/js-square.svg';

import CodeEditor from './CodeEditor';
import CodeStep from './CodeStep';

const CodeManager = {
  type: BlockType.CODE,
  icon: JavaScriptIcon,

  editor: CodeEditor,
  step: CodeStep,

  label: 'Code',
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
