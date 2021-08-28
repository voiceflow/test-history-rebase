import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import IfEditor from './IfEditorV2';
import IfStep from './IfStep';
import { EDITORS_BY_PATH } from './subeditors';

const IfManagerV2: NodeManagerConfig<NodeData.IfV2> = {
  ...NODE_CONFIG,

  tip: 'Set conditions that activate paths only when true',
  label: 'Condition',

  step: IfStep,
  editor: IfEditor,

  editorsByPath: EDITORS_BY_PATH,
};

export default IfManagerV2;
