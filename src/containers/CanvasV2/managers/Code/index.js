import { BlockType } from '@/constants';
import JavaScriptIcon from '@/svgs/brands/js-square.svg';

import CodeEditor from './CodeEditor';

const CodeManager = {
  type: BlockType.CODE,
  editor: CodeEditor,
  icon: JavaScriptIcon,

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
