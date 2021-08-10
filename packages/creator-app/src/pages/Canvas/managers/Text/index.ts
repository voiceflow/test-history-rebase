import { PlatformType } from '@voiceflow/internal';

import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import TextEditor from './TextEditor';
import TextStep from './TextStep';

const TextManager: NodeManagerConfig<NodeData.Text> = {
  ...NODE_CONFIG,

  label: 'Text',
  platforms: [PlatformType.CHATBOT],

  step: TextStep,
  editor: TextEditor,
};

export default TextManager;
