import { SLOT_REGEXP } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { RESPONSE_STEPS_LINK } from '@/constants';
import { NodeCategory } from '@/contexts/SearchContext/types';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import SpeakEditor from './SpeakEditor';
// eslint-disable-next-line import/no-named-as-default
import SpeakStep from './SpeakStep';
import SpeakManagerV2 from './v2';

const SpeakManager: NodeManagerConfig<Realtime.NodeData.Speak, Realtime.NodeData.SpeakBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Speak',
  getDataLabel: (data) => NODE_CONFIG.factory(data).data.name,

  step: SpeakStep,
  editor: SpeakEditor,

  searchIcon: 'systemMessage',
  searchCategory: NodeCategory.RESPONSES,
  getSearchParams: (data) => data.dialogs.map((dialog) => (Realtime.isSSML(dialog) ? dialog.content : dialog.url).replace(SLOT_REGEXP, '{$1}')),

  v2: SpeakManagerV2,

  tooltipLink: RESPONSE_STEPS_LINK,
};

export default SpeakManager;
