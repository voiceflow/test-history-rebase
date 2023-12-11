import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';
import { NodeCategory } from '@/contexts/SearchContext/types';
import { Designer, Feature, Intent } from '@/ducks';

import { NodeManagerConfigV2 } from '../types';
import { Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

const ChoiceManager: NodeManagerConfigV2<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Choice',

  step: Step,
  editorV2: Editor,

  searchCategory: NodeCategory.USER_INPUT,
  getSearchParams: (data, state) =>
    data.choices.reduce<string[]>((acc, choice) => {
      const intent = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.V2_CMS)
        ? Designer.Intent.selectors.oneWithFormattedBuiltNameByID(state, { id: choice.intent })
        : Intent.platformIntentByIDSelector(state, { id: choice.intent });

      if (intent?.name) acc.push(intent.name);

      return acc;
    }, []),

  tooltipText: 'Configures pre-defined paths and choices.',
  tooltipLink: Documentation.CHOICE_STEP,
};

export default ChoiceManager;
