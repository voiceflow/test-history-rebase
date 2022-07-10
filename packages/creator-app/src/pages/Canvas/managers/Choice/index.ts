import * as Realtime from '@voiceflow/realtime-sdk';

import { INPUT_STEPS_LINK } from '@/constants';
import { NodeCategory } from '@/contexts/SearchContext/types';
import * as Intent from '@/ducks/intentV2';

import { NodeManagerConfigV2 } from '../types';
import { Editor } from './components';
import { NODE_CONFIG } from './constants';
import { Step } from './v2';

const ChoiceManager: NodeManagerConfigV2<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Choice',

  step: Step,
  editorV2: Editor,

  searchCategory: NodeCategory.USER_INPUT,
  getSearchParams: (data, state) =>
    data.choices.reduce<string[]>((acc, choice) => {
      const intentName = Intent.formattedIntentNameByIDSelector(state, { id: choice.intent });
      if (intentName) acc.push(intentName);
      return acc;
    }, []),

  tooltipText: 'Add choices to your assistant.',
  tooltipLink: INPUT_STEPS_LINK,
};

export default ChoiceManager;
