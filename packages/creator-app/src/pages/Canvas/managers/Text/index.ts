import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import * as Documentation from '@/config/documentation';
import { NodeCategory } from '@/contexts/SearchContext/types';
import { serializeSlateToText } from '@/utils/slate';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import TextEditor from './TextEditor';
import TextStep from './TextStep';
import TextManagerV2 from './v2';

const TextManager: NodeManagerConfig<Realtime.NodeData.Text, Realtime.NodeData.TextBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Text',
  projectTypes: [VoiceflowConstants.ProjectType.CHAT],

  step: TextStep,
  editor: TextEditor,

  v2: TextManagerV2,

  searchIcon: 'systemText',
  searchCategory: NodeCategory.RESPONSES,
  getSearchParams: (data) => data.texts.map(({ content }) => serializeSlateToText(content)),

  tooltipText: 'Text messages shown in chat.',
  tooltipLink: Documentation.TEXT_STEP,
};

export default TextManager;
