import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { serializeToText } from '@voiceflow/slate-serializer/text';

import * as Documentation from '@/config/documentation';
import { NodeCategory } from '@/contexts/SearchContext/types';

import { NodeManagerConfigV2 } from '../types';
import { Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

const TextManager: NodeManagerConfigV2<Realtime.NodeData.Text, Realtime.NodeData.TextBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Text',
  projectTypes: [Platform.Constants.ProjectType.CHAT],

  step: Step,
  editorV2: Editor,

  searchCategory: NodeCategory.RESPONSES,
  getSearchParams: (data) => data.texts.map(({ content }) => serializeToText(content)),

  tooltipText: 'Text messages shown in chat.',
  tooltipLink: Documentation.TEXT_STEP,
};

export default TextManager;
