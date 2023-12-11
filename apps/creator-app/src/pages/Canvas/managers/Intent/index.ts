import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';
import { Designer, Feature, Intent } from '@/ducks';

import { NodeManagerConfigV2 } from '../types';
import { Chip, Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

const IntentManager: NodeManagerConfigV2<Realtime.NodeData.Intent, Realtime.NodeData.IntentBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Intent',

  step: Step,
  chip: Chip,
  editorV2: Editor,

  tooltipText: 'Listens for the linked intent and triggers the conversation path.',
  tooltipLink: Documentation.INTENT_STEP,

  searchIcon: 'goToBlock',
  getSearchParams: (data, state) => {
    const intent = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.V2_CMS)
      ? Designer.Intent.selectors.oneWithFormattedBuiltNameByID(state, { id: data.intent })
      : Intent.platformIntentByIDSelector(state, { id: data.intent });

    return intent?.name ? [intent.name] : [];
  },
};

export default IntentManager;
