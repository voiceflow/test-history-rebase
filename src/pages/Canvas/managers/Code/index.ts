import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
import CodeEditor from './CodeEditor';
import CodeStep from './CodeStep';

const CodeManager: NodeConfig<NodeData.Code> = {
  type: BlockType.CODE,
  icon: 'power',
  iconColor: '#cdad32',
  addable: true,

  label: 'Code',
  labelV2: 'Custom Code',
  tip: 'Modify Variables directly with Code',

  step: CodeStep,
  editor: CodeEditor,

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
