import type * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';
import { NodeCategory } from '@/contexts/SearchContext/types';
import { Designer } from '@/ducks';

import type { NodeManagerConfigV2 } from '../types';
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
      const intent = Designer.Intent.selectors.oneWithFormattedBuiltNameByID(state, { id: choice.intent });

      if (intent?.name) acc.push(intent.name);

      return acc;
    }, []),

  tooltipText: 'Configures pre-defined paths and choices.',
  tooltipLink: Documentation.CHOICE_STEP,
};

export default ChoiceManager;
