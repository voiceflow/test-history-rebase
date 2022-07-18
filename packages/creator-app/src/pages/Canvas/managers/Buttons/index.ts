import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { INPUT_STEPS_LINK } from '@/constants';
import { NodeCategory } from '@/contexts/SearchContext/types';
import * as Intent from '@/ducks/intentV2';

import { NodeManagerConfigV2 } from '../types';
import { Editor } from './components';
import { NODE_CONFIG } from './constants';
import { Step } from './v2';

const ButtonsManager: NodeManagerConfigV2<Realtime.NodeData.Buttons, Realtime.NodeData.ButtonsBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Buttons',
  projectTypes: [VoiceflowConstants.ProjectType.CHAT],

  step: Step,
  editorV2: Editor,

  searchCategory: NodeCategory.USER_INPUT,
  getSearchParams: (data, state) =>
    data.buttons.reduce<string[]>((acc, button) => {
      if (button.name) acc.push(button.name);

      const intentName = Intent.formattedIntentNameByIDSelector(state, { id: button.intent });
      if (intentName) acc.push(intentName);
      return acc;
    }, []),

  tooltipText: 'Interactive buttons connected to URLs or conversation paths.',
  tooltipLink: INPUT_STEPS_LINK,
};

export default ButtonsManager;
